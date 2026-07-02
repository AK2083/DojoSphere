import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('competitors.repository', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  it('returns an empty list before competitors are added', async () => {
    await initTestDatabase()
    const { getCompetitors } = await import('./competitors.repository')

    expect(getCompetitors()).toEqual([])
  })

  it('persists and returns created competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitors } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'List Keeper', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    expect(competitor).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })
    expect(competitor.id).toEqual(expect.any(String))
    expect(getCompetitors()).toHaveLength(1)
  })

  it('returns a competitor by id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Get Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(getCompetitor(competitor.id)).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })
    expect(getCompetitor('missing-competitor-id')).toBeNull()
  })

  it('stores optional fields with null defaults', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'List Keeper', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(competitor).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Unknown',
      weightClass: '-34'
    })
  })

  it('resolves plus-prefixed weight classes', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Plus Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '+66'
    })

    expect(competitor.weightClass).toBe('+66')
  })

  it('accepts explicit club and weight class ids', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { UNKNOWN_CLUB_ID, DEFAULT_WEIGHT_CLASS_ID } =
      await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Id Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      clubId: UNKNOWN_CLUB_ID,
      weightClassId: DEFAULT_WEIGHT_CLASS_ID
    })

    expect(competitor.clubId).toBe(UNKNOWN_CLUB_ID)
    expect(competitor.weightClassId).toBe(DEFAULT_WEIGHT_CLASS_ID)
  })

  it('reuses an existing club when the name already exists', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Club Actor', userType: 'system' })

    const first = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo'
    })
    const second = addCompetitor(actorUserId, {
      givenName: 'Hana',
      familyName: 'Sato',
      club: 'Tokyo Dojo'
    })

    expect(second.clubId).toBe(first.clubId)
  })

  it('falls back to the default weight class for unparseable values', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { DEFAULT_WEIGHT_CLASS_ID } = await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Fallback Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: 'open'
    })

    expect(competitor.weightClassId).toBe(DEFAULT_WEIGHT_CLASS_ID)
    expect(competitor.weightClass).toBe('-34')
  })

  it('falls back when the weight class string is only a sign', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { DEFAULT_WEIGHT_CLASS_ID } = await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Sign Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '+'
    })

    expect(competitor.weightClassId).toBe(DEFAULT_WEIGHT_CLASS_ID)
  })

  it('falls back to the default weight class when a plus class is unknown', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { DEFAULT_WEIGHT_CLASS_ID } = await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Plus Fallback Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '+999'
    })

    expect(competitor.weightClassId).toBe(DEFAULT_WEIGHT_CLASS_ID)
  })

  it('falls back to the default weight class when a minus class is unknown', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { DEFAULT_WEIGHT_CLASS_ID } = await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Minus Fallback Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '-999'
    })

    expect(competitor.weightClassId).toBe(DEFAULT_WEIGHT_CLASS_ID)
  })

  it('formats decimal weight classes without trailing zeros', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitors } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Decimal Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '-60'
    })
    const db = getDatabase()

    db.prepare(`UPDATE weight_classes SET max_weight_kg = 60.5 WHERE id = ?`).run(
      competitor.weightClassId
    )

    expect(getCompetitors()[0]?.weightClass).toBe('-60.5')
  })

  it('returns null weight class display when limits are missing', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitors } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Display Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      weightClass: '-60'
    })
    const db = getDatabase()

    db.exec('PRAGMA foreign_keys = OFF')
    db.prepare(`UPDATE competitors SET weight_class_id = 'missing-weight-class' WHERE id = ?`).run(
      competitor.id
    )

    expect(getCompetitors()[0]?.weightClass).toBeNull()
  })

  it('persists all detail fields when provided', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Detail Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'm',
      birthDate: '2011-04-12',
      nationality: 'de',
      passNumber: 'JP-000142',
      gradeId: 'a1000000-0000-4000-8000-000000000001',
      licenseNumber: 'WL-1',
      contactPhone: '+49 1',
      coach: 'Coach'
    })

    expect(competitor).toMatchObject({
      gender: 'm',
      birthDate: '2011-04-12',
      nationality: 'DE',
      passNumber: 'JP-000142',
      gradeId: 'a1000000-0000-4000-8000-000000000001',
      licenseNumber: 'WL-1',
      contactPhone: '+49 1',
      coach: 'Coach'
    })
  })

  it('falls back to defaults for invalid or empty detail fields', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { DEFAULT_GENDER, DEFAULT_NATIONALITY, DEFAULT_BIRTH_DATE, DEFAULT_PASS_NUMBER } =
      await import('@main/shared/database/reference-seed-ids')

    const { id: actorUserId } = addUser({ displayName: 'Default Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'x' as never,
      birthDate: '   ',
      nationality: '  ',
      passNumber: '   ',
      gradeId: '   ',
      licenseNumber: '   ',
      contactPhone: '   ',
      coach: '   '
    })

    expect(competitor).toMatchObject({
      gender: DEFAULT_GENDER,
      nationality: DEFAULT_NATIONALITY,
      birthDate: DEFAULT_BIRTH_DATE,
      passNumber: DEFAULT_PASS_NUMBER,
      gradeId: null,
      licenseNumber: null,
      contactPhone: null,
      coach: null
    })
  })

  it('updates detail fields without recording a field-name audit', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Detail Update Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const updated = updateCompetitor(actorUserId, competitor.id, {
      gender: 'd',
      birthDate: '2010-01-01',
      nationality: 'AT',
      passNumber: 'JP-999',
      gradeId: 'a1000000-0000-4000-8000-000000000001',
      licenseNumber: 'WL-9',
      contactPhone: '+43 9',
      coach: 'Coach B'
    })

    expect(updated).toMatchObject({
      gender: 'd',
      birthDate: '2010-01-01',
      nationality: 'AT',
      passNumber: 'JP-999',
      gradeId: 'a1000000-0000-4000-8000-000000000001',
      licenseNumber: 'WL-9',
      contactPhone: '+43 9',
      coach: 'Coach B'
    })

    const auditCount = getDatabase()
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { count: number }

    expect(auditCount.count).toBe(0)
  })

  it('throws when creating a competitor with an empty given name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: '   ',
        familyName: 'Tanaka'
      })
    ).toThrow('Given name must not be empty')
  })

  it('throws when creating a competitor with an empty family name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: 'Yuki',
        familyName: '   '
      })
    ).toThrow('Family name must not be empty')
  })

  it('throws when the competitor row disappears after insert', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Insert Actor', userType: 'system' })
    const db = getDatabase()
    const originalPrepare = db.prepare.bind(db)

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      const statement = originalPrepare(sql)

      if (!sql.includes('INSERT INTO competitors')) {
        return statement
      }

      return {
        run: (...args: unknown[]) => {
          const result = statement.run(...args)

          vi.spyOn(db, 'prepare').mockImplementation((innerSql: string) => {
            if (innerSql.includes('FROM competitors') && innerSql.includes('WHERE c.id = ?')) {
              return {
                get: () => undefined
              } as never
            }

            return originalPrepare(innerSql)
          })

          return result
        }
      } as never
    })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: 'Yuki',
        familyName: 'Tanaka'
      })
    ).toThrow('Competitor not found')
  })

  it('records a created audit row when adding a competitor', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Audit Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'created'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
      newValueJson: string
    }

    expect(auditRow).toMatchObject({
      action: 'created',
      entityType: 'competitor',
      entityId: competitor.id,
      actorUserId,
      newValueJson: JSON.stringify({
        fields: ['given_name', 'family_name', 'club', 'weight_class']
      })
    })
    expect(auditRow.newValueJson).not.toContain('Yuki')
    expect(auditRow.newValueJson).not.toContain('Tanaka')
    expect(auditRow.newValueJson).not.toContain('Tokyo Dojo')
  })

  it('updates competitors and records changed field names only', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    const updated = updateCompetitor(actorUserId, competitor.id, {
      club: 'Osaka Dojo',
      weightClass: '-66'
    })

    expect(updated).toMatchObject({
      club: 'Osaka Dojo',
      weightClass: '-66',
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { action: string; newValueJson: string }

    expect(auditRow).toMatchObject({
      action: 'updated',
      newValueJson: JSON.stringify({ changed_fields: ['club', 'weight_class'] })
    })
    expect(auditRow.newValueJson).not.toContain('Osaka Dojo')
  })

  it('updates given and family names when provided explicitly', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Name Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const updated = updateCompetitor(actorUserId, competitor.id, {
      givenName: '  Hana  ',
      familyName: '  Sato  '
    })

    expect(updated).toMatchObject({
      givenName: 'Hana',
      familyName: 'Sato'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { newValueJson: string }

    expect(JSON.parse(auditRow.newValueJson)).toEqual({
      changed_fields: ['given_name', 'family_name']
    })
  })

  it('throws when updating an unknown competitor id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Missing Actor', userType: 'system' })

    expect(() =>
      updateCompetitor(actorUserId, 'missing-competitor-id', {
        club: 'Osaka Dojo'
      })
    ).toThrow('Competitor not found')
  })

  it('throws when updating with an empty given name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        givenName: '   '
      })
    ).toThrow('Given name must not be empty')
  })

  it('throws when updating with an empty family name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        familyName: '   '
      })
    ).toThrow('Family name must not be empty')
  })

  it('throws when the competitor row disappears after update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })
    const db = getDatabase()
    const originalPrepare = db.prepare.bind(db)

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      const statement = originalPrepare(sql)

      if (!sql.includes('UPDATE competitors')) {
        return statement
      }

      return {
        run: (...args: unknown[]) => {
          const result = statement.run(...args)

          vi.spyOn(db, 'prepare').mockImplementation((innerSql: string) => {
            if (innerSql.includes('FROM competitors') && innerSql.includes('WHERE c.id = ?')) {
              return {
                get: () => undefined
              } as never
            }

            return originalPrepare(innerSql)
          })

          return result
        }
      } as never
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        club: 'Osaka Dojo'
      })
    ).toThrow('Competitor not found')
  })

  it('skips update audit when no fields change', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'No-op Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    updateCompetitor(actorUserId, competitor.id, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const auditCount = getDatabase()
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { count: number }

    expect(auditCount.count).toBe(0)
  })

  it('throws when deleting an unknown competitor id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { deleteCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })

    expect(() => deleteCompetitor(actorUserId, 'missing-competitor-id')).toThrow(
      'Competitor not found'
    )
  })

  it('deletes competitors and records a deleted audit row', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, deleteCompetitor, getCompetitors } =
      await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    deleteCompetitor(actorUserId, competitor.id)

    expect(getCompetitors()).toEqual([])

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'deleted'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
    }

    expect(auditRow).toMatchObject({
      action: 'deleted',
      entityType: 'competitor',
      entityId: competitor.id,
      actorUserId
    })
  })
})
