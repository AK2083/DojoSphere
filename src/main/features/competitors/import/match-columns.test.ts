import { describe, expect, it } from 'vitest'

import { matchColumns } from './match-columns'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'

function column(
  partial: Partial<ParsedColumn> & Pick<ParsedColumn, 'id' | 'header'>
): ParsedColumn {
  return {
    sheetName: 'Sheet1',
    columnIndex: 0,
    values: [],
    ...partial
  }
}

function workbook(
  columns: ParsedColumn[],
  formFields: ParsedWorkbook['formFields'] = []
): ParsedWorkbook {
  return { sheetNames: ['Sheet1'], columns, formFields }
}

describe('matchColumns', () => {
  it('maps columns by exact header synonyms', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Verein', values: ['Dojo Nord'] })
      ])
    )

    expect(result.mapping.givenName).toBe('Sheet1#0')
    expect(result.mapping.familyName).toBe('Sheet1#1')
    expect(result.mapping.club).toBe('Sheet1#2')
    expect(result.sources.givenName).toBe('header')
    expect(result.mappingValid).toBe(true)
    expect(result.missingRequiredFields).toEqual([])
  })

  it('falls back to data-type inference for unknown headers', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki', 'Anna'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka', 'Weber'] }),
        column({ id: 'Sheet1#2', header: 'Spalte X', values: ['m', 'w', 'd', 'm'] })
      ])
    )

    expect(result.mapping.gender).toBe('Sheet1#2')
    expect(result.sources.gender).toBe('data')
  })

  it('reports required fields that stay unmapped', () => {
    const result = matchColumns(
      workbook([column({ id: 'Sheet1#0', header: 'Verein', values: ['Dojo Nord'] })])
    )

    expect(result.mappingValid).toBe(false)
    expect(result.missingRequiredFields).toContain('givenName')
    expect(result.missingRequiredFields).toContain('familyName')
  })

  it('prefers Pass-Nr. over Nr. for pass number via header specificity', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Nr.', values: ['1', '2'] }),
        column({ id: 'Sheet1#3', header: 'Pass.-Nr.', values: ['JP-1', 'JP-2'] }),
        column({ id: 'Sheet1#4', header: 'Lizenz-Nr.', values: ['L-1', 'L-2'] })
      ])
    )

    expect(result.mapping.passNumber).toBe('Sheet1#3')
    expect(result.mapping.licenseNumber).toBe('Sheet1#4')
  })

  it('maps Pass-Nr. header to pass number', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Pass-Nr.', values: ['12345678', '87654321'] })
      ])
    )

    expect(result.mapping.passNumber).toBe('Sheet1#2')
    expect(result.sources.passNumber).toBe('header')
  })

  it('does not map Pass-Nr. to license number', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Pass-Nr.', values: ['12345678'] }),
        column({ id: 'Sheet1#3', header: 'Lizenz-Nr.', values: ['L-1'] })
      ])
    )

    expect(result.mapping.passNumber).toBe('Sheet1#2')
    expect(result.mapping.licenseNumber).toBe('Sheet1#3')
  })

  it('maps Kyu column to grade by header synonym', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Kyu', values: ['8.', '6.'] })
      ])
    )

    expect(result.mapping.grade).toBe('Sheet1#2')
    expect(result.sources.grade).toBe('header')
  })

  it('ignores short generic headers for fuzzy matching', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Nr.', values: ['1', '2'] })
      ])
    )

    expect(result.mapping.passNumber).toBeUndefined()
  })

  it('does not map registration header fields that are not participant fields', () => {
    const result = matchColumns(
      workbook(
        [
          column({ id: 'Sheet1#0', header: 'Vorname', values: ['Lina'] }),
          column({ id: 'Sheet1#1', header: 'Nachname', values: ['Bauer'] })
        ],
        [
          {
            id: 'Sheet1#form#0#0',
            sheetName: 'Sheet1',
            label: 'Ausrichter',
            value: 'Judo-Club Musterstadt'
          },
          {
            id: 'Sheet1#form#0#2',
            sheetName: 'Sheet1',
            label: 'Veranstaltung',
            value: 'Musterstadt Nachwuchs'
          }
        ]
      )
    )

    expect(result.mapping).not.toHaveProperty('eventHost')
    expect(result.mapping).not.toHaveProperty('eventName')
  })

  it('does not assign the same column to two fields', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Name', values: ['Tanaka'] })
      ])
    )

    const assigned = Object.values(result.mapping)

    expect(new Set(assigned).size).toBe(assigned.length)
  })

  it('does not infer nationality from unrelated two-letter column values', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Kürzel', values: ['de', 'at', 'ch'] })
      ])
    )

    expect(result.mapping.nationality).toBeUndefined()
  })

  it('maps Status to registrationStatus and never to nationality', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Status', values: ['gemeldet', 'nachmeldung'] })
      ])
    )

    expect(result.mapping.registrationStatus).toBe('Sheet1#2')
    expect(result.mapping.nationality).toBeUndefined()
  })

  it('does not map a Status column to nationality even when status is taken elsewhere', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Meldestatus', values: ['gemeldet'] }),
        column({ id: 'Sheet1#3', header: 'Status', values: ['gemeldet'] })
      ])
    )

    expect(result.mapping.nationality).toBeUndefined()
  })

  it('keeps nationality and status separate when both headers are present', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Nationalität', values: ['DE', 'AT'] }),
        column({ id: 'Sheet1#3', header: 'Status', values: ['gemeldet', 'nachmeldung'] })
      ])
    )

    expect(result.mapping.nationality).toBe('Sheet1#2')
    expect(result.mapping.registrationStatus).toBe('Sheet1#3')
  })

  it('maps compatible registration form fields and ignores metadata labels', () => {
    const result = matchColumns(
      workbook(
        [
          column({ id: 'Sheet1#0', header: 'Vorname', values: ['Lina'] }),
          column({ id: 'Sheet1#1', header: 'Nachname', values: ['Bauer'] }),
          column({
            id: 'Sheet1#2',
            header: 'Coach / Kontakt am Wettkampftag',
            values: ['S. Fischer']
          })
        ],
        [
          {
            id: 'Sheet1#form#0#0',
            sheetName: 'Sheet1',
            label: 'Kontaktperson',
            value: 'Form Contact'
          },
          {
            id: 'Sheet1#form#0#1',
            sheetName: 'Sheet1',
            label: 'E-Mail Vereinsverantwortlicher',
            value: 'kontakt@example-dojo.invalid'
          }
        ]
      )
    )

    expect(result.mapping.contactPerson).toBe('Sheet1#2')
    expect(result.mapping.clubContactEmail).toBe('Sheet1#form#0#1')
    expect(result.mapping.remarks).toBeUndefined()
  })

  it('does not cross-map pass and license dedicated headers', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({ id: 'Sheet1#2', header: 'Pass-Nr.', values: ['JP-1'] }),
        column({ id: 'Sheet1#3', header: 'Lizenz-Nr.', values: ['L-1'] })
      ])
    )

    expect(result.mapping.passNumber).toBe('Sheet1#2')
    expect(result.mapping.licenseNumber).toBe('Sheet1#3')
    expect(result.mapping.passNumber).not.toBe(result.mapping.licenseNumber)
  })
})
