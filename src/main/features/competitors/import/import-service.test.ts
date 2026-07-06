import * as XLSX from 'xlsx'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

function buildWorkbook(rows: unknown[][]): ArrayBuffer {
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Teilnehmer')

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

describe('import-service', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  it('previews columns and suggests a valid mapping for required fields', async () => {
    await initTestDatabase()
    const { previewImport } = await import('./import-service')

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Verein', 'Gewichtsklasse'],
      ['Yuki', 'Tanaka', 'Dojo Nord', '-46']
    ])

    const preview = previewImport(buffer)

    expect(preview.columns).toHaveLength(4)
    expect(preview.rowCount).toBe(1)
    expect(preview.mappingValid).toBe(true)
    expect(preview.suggestedMapping.givenName).toBeTruthy()
    expect(preview.suggestedMapping.familyName).toBeTruthy()
    expect(preview.fields.some((field) => field.key === 'givenName' && field.required)).toBe(true)
  })

  it('imports valid rows atomically and reports per-row failures', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Import Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Verein', 'Gewichtsklasse'],
      ['Yuki', 'Tanaka', 'Dojo Nord', '-46'],
      ['', 'Weber', 'Dojo Süd', '-52'],
      ['Anna', 'Chen', 'Dojo Nord', '-40']
    ])

    const mapping = {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      club: 'Teilnehmer#2'
    }

    const progress: Array<[number, number]> = []
    const result = executeImport(actorUserId, buffer, mapping, (processed, total) => {
      progress.push([processed, total])
    })

    expect(result.results).toHaveLength(3)
    expect(result.importedCount).toBe(2)
    expect(result.failedCount).toBe(1)
    expect(result.results[1]).toMatchObject({ success: false, familyName: 'Weber' })
    expect(result.results[1]?.errorCode).toBe('import_failed')
    expect(progress.at(-1)).toEqual([3, 3])

    expect(getCompetitors()).toHaveLength(2)
  })

  it('stores club contact email on the club record when mapped', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { getDatabase } = await import('@main/shared/database')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Import Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Verein', 'E-Mail Vereinsverantwortlicher'],
      ['Lina', 'Bauer', 'Dojo Nord', 'kontakt@example-dojo.invalid']
    ])

    executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      club: 'Teilnehmer#2',
      clubContactEmail: 'Teilnehmer#3'
    })

    const [competitor] = getCompetitors()
    const db = getDatabase()
    const contact = db
      .prepare(
        `SELECT value FROM club_contacts WHERE club_id = ? AND contact_type = 'email' LIMIT 1`
      )
      .get(competitor?.clubId) as { value: string } | undefined

    expect(contact?.value).toBe('kontakt@example-dojo.invalid')
    expect(competitor?.remarks).toBeNull()
  })

  it('resolves the weight class from a raw kilogram column when no class is mapped', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Weight Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Gewicht'],
      ['Yuki', 'Tanaka', '45']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      weightKg: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]?.weightClass).toBeTruthy()
  })

  it('includes registration form fields in preview columns', async () => {
    await initTestDatabase()
    const { previewImport } = await import('./import-service')

    const buffer = buildWorkbook([
      ['Ausrichter', 'Dojo Nord', 'Kontaktperson', 'S. Fischer'],
      ['Vorname', 'Nachname'],
      ['Yuki', 'Tanaka']
    ])

    const preview = previewImport(buffer)

    expect(preview.columns.some((column) => column.sourceKind === 'form')).toBe(true)
    expect(
      preview.columns.find((column) => column.header === 'Kontaktperson')?.sampleValues
    ).toEqual(['S. Fischer'])
  })

  it('throws when the workbook has no participant rows', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Empty Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname'],
      ['', '']
    ])

    expect(() =>
      executeImport(actorUserId, buffer, {
        givenName: 'Teilnehmer#0',
        familyName: 'Teilnehmer#1'
      })
    ).toThrow('empty_workbook')
  })

  it('resolves grade ids when a grade column is mapped', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Grade Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Kyu'],
      ['Yuki', 'Tanaka', '8.']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      grade: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]?.gradeId).toBeTruthy()
  })

  it('skips grade resolution when the mapped grade cell is empty', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'Empty Grade Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Kyu'],
      ['Yuki', 'Tanaka', '']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      grade: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]?.gradeId).toBeNull()
  })

  it('skips grade resolution when the grade column is not mapped', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({ displayName: 'No Grade Actor', userType: 'system' })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Kyu'],
      ['Yuki', 'Tanaka', '8.']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]?.gradeId).toBeNull()
  })

  it('handles missing row results from the repository gracefully', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    vi.spyOn(repository, 'importCompetitors').mockReturnValue([])

    const { id: actorUserId } = addUser({ displayName: 'Missing Row Actor', userType: 'system' })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname'],
      ['Yuki', 'Tanaka']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1'
    })

    expect(result.importedCount).toBe(0)
    expect(result.failedCount).toBe(1)
    expect(result.results[0]?.success).toBe(false)
  })

  it('imports successfully without persisting club contact email when it is not mapped', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const upsertSpy = vi.spyOn(repository, 'upsertClubContactEmail')

    const { id: actorUserId } = addUser({ displayName: 'No Email Actor', userType: 'system' })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname'],
      ['Yuki', 'Tanaka']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1'
    })

    expect(result.importedCount).toBe(1)
    expect(upsertSpy).not.toHaveBeenCalled()
  })

  it('skips club contact email persistence when the imported competitor has no club', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const upsertSpy = vi.spyOn(repository, 'upsertClubContactEmail')
    vi.spyOn(repository, 'importCompetitors').mockReturnValue([
      {
        index: 0,
        success: true,
        competitor: {
          id: 'competitor-without-club',
          clubId: null
        } as never
      }
    ])

    const { id: actorUserId } = addUser({ displayName: 'No Club Actor', userType: 'system' })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'E-Mail Vereinsverantwortlicher'],
      ['Yuki', 'Tanaka', 'kontakt@example-dojo.invalid']
    ])

    executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      clubContactEmail: 'Teilnehmer#2'
    })

    expect(upsertSpy).not.toHaveBeenCalled()
  })

  it('continues when a mapped grade cannot be resolved to a reference id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('../repository/competitors.repository')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    vi.spyOn(repository, 'resolveGradeIdFromText').mockReturnValue(null)

    const { id: actorUserId } = addUser({ displayName: 'Grade Fallback Actor', userType: 'system' })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Kyu'],
      ['Yuki', 'Tanaka', '8.']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      grade: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]?.gradeId).toBeNull()
  })

  it('maps optional participant fields when columns are provided', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({
      displayName: 'Optional Fields Actor',
      userType: 'system'
    })
    const buffer = buildWorkbook([
      [
        'Vorname',
        'Nachname',
        'Pass-Nr.',
        'Lizenz-Nr.',
        'Geschlecht',
        'Nationalität',
        'Geburtsdatum',
        'Verein',
        'Gewicht'
      ],
      ['Yuki', 'Tanaka', 'JP-1', 'WL-1', 'm', 'DE', '2012-01-01', 'Dojo Nord', '45']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      passNumber: 'Teilnehmer#2',
      licenseNumber: 'Teilnehmer#3',
      gender: 'Teilnehmer#4',
      nationality: 'Teilnehmer#5',
      birthDate: 'Teilnehmer#6',
      club: 'Teilnehmer#7',
      weightKg: 'Teilnehmer#8'
    })

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()[0]).toMatchObject({
      passNumber: 'JP-1',
      licenseNumber: 'WL-1',
      gender: 'm',
      nationality: 'DE',
      birthDate: '2012-01-01',
      club: 'Dojo Nord'
    })
  })

  it('omits the weight class id when resolution returns null', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const importSpy = vi.spyOn(repository, 'importCompetitors')
    vi.spyOn(repository, 'resolveWeightClassIdFromKg').mockReturnValue(null)

    const { id: actorUserId } = addUser({
      displayName: 'Weight Fallback Actor',
      userType: 'system'
    })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Gewicht'],
      ['Yuki', 'Tanaka', '45']
    ])

    executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      weightKg: 'Teilnehmer#2'
    })

    expect(importSpy.mock.calls[0]?.[1]?.[0]?.weightClassId).toBeUndefined()
  })

  it('rejects duplicate rows within the same import file', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({
      displayName: 'Duplicate Import Actor',
      userType: 'system'
    })
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Pass-Nr.'],
      ['Yuki', 'Tanaka', 'JP-1'],
      ['Yuki', 'Tanaka', 'JP-1']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      passNumber: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(1)
    expect(result.failedCount).toBe(1)
    expect(result.results[1]).toMatchObject({
      success: false,
      errorCode: 'duplicate_in_import'
    })
    expect(getCompetitors()).toHaveLength(1)
  })

  it('rejects rows that match an existing participant in the database', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitors } = await import('../repository/competitors.repository')
    const { executeImport } = await import('./import-service')

    const { id: actorUserId } = addUser({
      displayName: 'Existing Duplicate Actor',
      userType: 'system'
    })

    addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      passNumber: 'JP-1'
    })

    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Pass-Nr.'],
      ['Other', 'Person', 'JP-1']
    ])

    const result = executeImport(actorUserId, buffer, {
      givenName: 'Teilnehmer#0',
      familyName: 'Teilnehmer#1',
      passNumber: 'Teilnehmer#2'
    })

    expect(result.importedCount).toBe(0)
    expect(result.failedCount).toBe(1)
    expect(result.results[0]).toMatchObject({
      success: false,
      errorCode: 'duplicate_competitor'
    })
    expect(getCompetitors()).toHaveLength(1)
  })
})
