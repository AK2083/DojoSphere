import { describe, expect, it } from 'vitest'

import type { ColumnMapping } from './match-columns'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'
import { primarySheetColumns, transformRows } from './transform-row'

function column(id: string, sheetName: string, header: string, values: string[]): ParsedColumn {
  return { id, sheetName, columnIndex: 0, header, values }
}

function workbook(
  columns: ParsedColumn[],
  formFields: ParsedWorkbook['formFields'] = []
): ParsedWorkbook {
  const sheetNames = [...new Set(columns.map((entry) => entry.sheetName))]

  return { sheetNames, columns, formFields }
}

describe('transformRows', () => {
  it('transforms primary-sheet rows and skips rows without a name', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki', '', 'Anna']),
      column('T#1', 'T', 'Nachname', ['Tanaka', '', 'Weber']),
      column('T#2', 'T', 'Geschlecht', ['m', '', 'w']),
      column('T#3', 'T', 'Geburtsjahr', ['2012', '', '2011-05-06']),
      column('T#5', 'T', 'Verein', ['Dojo Nord', '', 'Dojo Süd']),
      column('T#6', 'T', 'Gewicht', ['52.5', '', '60'])
    ])

    const mapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      gender: 'T#2',
      birthDate: 'T#3',
      club: 'T#5',
      weightKg: 'T#6'
    }

    const participants = transformRows(wb, mapping)

    expect(participants).toHaveLength(2)
    expect(participants[0]).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'm',
      birthDate: '2012-01-01',
      club: 'Dojo Nord',
      weightKg: 52.5,
      startEligible: true,
      registrationStatus: null
    })
    expect(participants[1]).toMatchObject({
      givenName: 'Anna',
      gender: 'f',
      birthDate: '2011-05-06',
      weightKg: 60
    })
  })

  it('maps grade when present', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Kyu', ['8.'])
    ])

    const mapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      grade: 'T#2'
    }

    const [participant] = transformRows(wb, mapping)

    expect(participant).toMatchObject({
      grade: '8.'
    })
  })

  it('maps club contact email from table or form sources', () => {
    const wb = workbook(
      [
        column('T#0', 'T', 'Vorname', ['Lina', 'Emil']),
        column('T#1', 'T', 'Nachname', ['Bauer', 'Fischer']),
        column('T#2', 'T', 'E-Mail Vereinsverantwortlicher', [
          'kontakt@example-dojo.invalid',
          'anmeldung@example-jc.invalid'
        ])
      ],
      [
        {
          id: 'T#form#0#0',
          sheetName: 'T',
          label: 'E-Mail Vereinsverantwortlicher',
          value: 'formular@example-dojo.invalid'
        }
      ]
    )

    const tableMapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      clubContactEmail: 'T#2'
    }

    const formMapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      clubContactEmail: 'T#form#0#0'
    }

    expect(transformRows(wb, tableMapping)[0]?.clubContactEmail).toBe(
      'kontakt@example-dojo.invalid'
    )
    expect(transformRows(wb, formMapping)[0]?.clubContactEmail).toBe(
      'formular@example-dojo.invalid'
    )
  })

  it('enriches contactPerson and contact phone from a separate club sheet', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Verein', ['Dojo Nord']),
      column('V#0', 'V', 'Verein', ['Dojo Nord', 'Dojo Süd']),
      column('V#1', 'V', 'Trainer', ['S. Fischer', 'M. Keller']),
      column('V#2', 'V', 'Telefon', ['+49 1', '+49 2'])
    ])

    const mapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'T#2',
      contactPerson: 'V#1',
      contactPhone: 'V#2'
    }

    const [participant] = transformRows(wb, mapping)

    expect(participant).toMatchObject({
      givenName: 'Yuki',
      club: 'Dojo Nord',
      contactPerson: 'S. Fischer',
      contactPhone: '+49 1'
    })
  })

  it('parses start eligibility, registration status and remarks when mapped', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Startberechtigt', ['nein']),
      column('T#3', 'T', 'Status', ['Nachmeldung']),
      column('T#4', 'T', 'Bemerkung', ['Allergie beachten'])
    ])

    const mapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1',
      startEligible: 'T#2',
      registrationStatus: 'T#3',
      remarks: 'T#4'
    }

    const [participant] = transformRows(wb, mapping)

    expect(participant).toMatchObject({
      startEligible: false,
      registrationStatus: 'late_registration',
      remarks: 'Allergie beachten'
    })
  })

  it('treats explicit yes values as start eligible', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Startberechtigt', ['ja'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      startEligible: 'T#2'
    })

    expect(participant?.startEligible).toBe(true)
  })

  it('defaults unknown start eligibility values to eligible', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Startberechtigt', ['vielleicht'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      startEligible: 'T#2'
    })

    expect(participant?.startEligible).toBe(true)
  })

  it('returns no participants when no name column can anchor the primary sheet', () => {
    const wb = workbook([column('T#0', 'T', 'Verein', ['Dojo Nord'])])

    expect(transformRows(wb, { club: 'T#0' })).toEqual([])
  })

  it('applies Germany as nationality when the field is not mapped', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka'])
    ])

    const mapping: ColumnMapping = {
      givenName: 'T#0',
      familyName: 'T#1'
    }

    const [participant] = transformRows(wb, mapping)

    expect(participant?.nationality).toBe('DE')
  })

  it('parses european birth dates with two-digit years', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Geburtsdatum', ['01.02.12'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      birthDate: 'T#2'
    })

    expect(participant?.birthDate).toBe('2012-02-01')
  })

  it('skips club enrichment when the external sheet has no club column', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Verein', ['Dojo Nord']),
      column('V#1', 'V', 'Trainer', ['S. Fischer'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'T#2',
      contactPerson: 'V#1'
    })

    expect(participant?.contactPerson).toBeUndefined()
  })

  it('ignores empty club names in external enrichment sheets', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Verein', ['Dojo Nord']),
      column('V#0', 'V', 'Verein', ['', 'Dojo Nord']),
      column('V#1', 'V', 'Trainer', ['Ignored', 'S. Fischer'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'T#2',
      contactPerson: 'V#1'
    })

    expect(participant?.contactPerson).toBe('S. Fischer')
  })

  it('returns an empty remark when the mapped column has no value for a row', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki', 'Anna']),
      column('T#1', 'T', 'Nachname', ['Tanaka', 'Weber']),
      column('T#2', 'T', 'Bemerkung', ['First only'])
    ])

    const participants = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      remarks: 'T#2'
    })

    expect(participants).toHaveLength(2)
    expect(participants[1]?.remarks).toBeUndefined()
  })

  it('enriches phone numbers from an external club sheet', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Verein', ['Dojo Nord']),
      column('V#0', 'V', 'Verein', ['Dojo Nord']),
      column('V#1', 'V', 'Telefon', ['+49 555 010201'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'T#2',
      contactPhone: 'V#1'
    })

    expect(participant?.contactPhone).toBe('+49 555 010201')
  })

  it('uses an explicitly mapped club column on the external enrichment sheet', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('V#0', 'V', 'Verein', ['Dojo Nord']),
      column('V#1', 'V', 'Trainer', ['S. Fischer'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'V#0',
      contactPerson: 'V#1'
    })

    expect(participant).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })
  })

  it('applies repository defaults for unmapped form-required fields', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1'
    })

    expect(participant).toMatchObject({
      gender: 'f',
      nationality: 'DE',
      birthDate: '2000-01-01',
      passNumber: '00000000'
    })
  })

  it('keeps mapped pass numbers and skips club enrichment without a club name', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Pass-Nr.', ['JP-42'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      passNumber: 'T#2'
    })

    expect(participant).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      passNumber: 'JP-42',
      club: undefined
    })
  })

  it('maps registration status values from a dedicated column', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Status', ['Nachmeldung'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      registrationStatus: 'T#2'
    })

    expect(participant?.registrationStatus).toBe('late_registration')
  })

  it('returns null for unknown registration status values', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Status', ['unbekannt'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      registrationStatus: 'T#2'
    })

    expect(participant?.registrationStatus).toBeNull()
  })

  it('parses birth dates with four-digit years', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki']),
      column('T#1', 'T', 'Nachname', ['Tanaka']),
      column('T#2', 'T', 'Geburtsdatum', ['01.02.2012'])
    ])

    const [participant] = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      birthDate: 'T#2'
    })

    expect(participant?.birthDate).toBe('2012-02-01')
  })

  it('ignores missing club names while building external enrichment', () => {
    const wb = workbook([
      column('T#0', 'T', 'Vorname', ['Yuki', 'Anna']),
      column('T#1', 'T', 'Nachname', ['Tanaka', 'Weber']),
      column('T#2', 'T', 'Verein', ['Dojo Nord', 'Dojo Süd']),
      column('V#0', 'V', 'Verein', ['Dojo Nord', undefined as unknown as string]),
      column('V#1', 'V', 'Trainer', ['S. Fischer'])
    ])

    const participants = transformRows(wb, {
      givenName: 'T#0',
      familyName: 'T#1',
      club: 'T#2',
      contactPerson: 'V#1'
    })

    expect(participants[0]?.contactPerson).toBe('S. Fischer')
    expect(participants[1]?.contactPerson).toBeUndefined()
  })
})

describe('primarySheetColumns', () => {
  it('returns an empty list when the sheet is missing from the lookup', () => {
    expect(primarySheetColumns(new Map(), 'Missing')).toEqual([])
  })
})
