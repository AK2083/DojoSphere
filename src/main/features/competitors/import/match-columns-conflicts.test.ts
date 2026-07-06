import { afterEach, describe, expect, it, vi } from 'vitest'

import { isConflictingHeaderMatch, headerFieldSpecificity, matchColumns } from './match-columns'
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

describe('matchColumns conflict handling', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects known cross-field header conflicts directly', () => {
    expect(isConflictingHeaderMatch('E-Mail', 'remarks')).toBe(true)
    expect(isConflictingHeaderMatch('Pass-Nr.', 'licenseNumber')).toBe(true)
    expect(isConflictingHeaderMatch('Lizenz-Nr.', 'passNumber')).toBe(true)
    expect(isConflictingHeaderMatch('E-Mail Ansprechpartner', 'contactPerson')).toBe(true)
    expect(isConflictingHeaderMatch('Kontaktperson', 'clubContactEmail')).toBe(true)
    expect(isConflictingHeaderMatch('Ausrichter', 'givenName')).toBe(true)
    expect(headerFieldSpecificity('---', 'givenName')).toBe(0)
  })

  it('ignores columns whose headers normalize to an empty string', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: '---', values: ['ignored'] }),
        column({ id: 'Sheet1#1', header: 'Vorname', values: ['Lina'] }),
        column({ id: 'Sheet1#2', header: 'Nachname', values: ['Bauer'] })
      ])
    )

    expect(result.mapping.givenName).toBe('Sheet1#1')
    expect(result.mapping.familyName).toBe('Sheet1#2')
  })

  it('does not map email form labels to remarks', () => {
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
            label: 'E-Mail Vereinsverantwortlicher',
            value: 'kontakt@example-dojo.invalid'
          }
        ]
      )
    )

    expect(result.mapping.remarks).toBeUndefined()
    expect(result.mapping.clubContactEmail).toBe('Sheet1#form#0#0')
  })

  it('does not map email headers to contact person', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Lina'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Bauer'] }),
        column({
          id: 'Sheet1#2',
          header: 'E-Mail Ansprechpartner',
          values: ['trainer@example-dojo.invalid']
        })
      ])
    )

    expect(result.mapping.contactPerson).toBeUndefined()
  })

  it('skips incompatible form field mappings when sample values mismatch the target type', () => {
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
            label: 'Lizenz-Nr.',
            value: '2012-01-01'
          }
        ]
      )
    )

    expect(result.mapping.licenseNumber).toBeUndefined()
  })

  it('blocks cross-mapping between pass and license form labels', () => {
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
            label: 'Pass-Nr.',
            value: 'JP-1'
          },
          {
            id: 'Sheet1#form#0#2',
            sheetName: 'Sheet1',
            label: 'Lizenz-Nr.',
            value: 'L-1'
          }
        ]
      )
    )

    expect(result.mapping.passNumber).toBe('Sheet1#form#0#0')
    expect(result.mapping.licenseNumber).toBe('Sheet1#form#0#2')
  })

  it('does not map remark synonyms onto email headers', () => {
    const result = matchColumns(
      workbook(
        [
          column({ id: 'Sheet1#0', header: 'Vorname', values: ['Lina'] }),
          column({ id: 'Sheet1#1', header: 'Nachname', values: ['Bauer'] }),
          column({
            id: 'Sheet1#2',
            header: 'E-Mail',
            values: ['kontakt@example-dojo.invalid']
          })
        ],
        [
          {
            id: 'Sheet1#form#0#0',
            sheetName: 'Sheet1',
            label: 'Bemerkung',
            value: 'Hinweis'
          }
        ]
      )
    )

    expect(result.mapping.remarks).toBe('Sheet1#form#0#0')
    expect(result.mapping.clubContactEmail).toBe('Sheet1#2')
  })

  it('skips event metadata form labels during candidate collection', () => {
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
            label: 'Wettkampftag',
            value: '19.09.2026'
          }
        ]
      )
    )

    expect(result.mapping).not.toHaveProperty('eventName')
  })

  it('collects form field candidates without sample values when the value cell is empty', () => {
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
            label: 'Pass-Nr.',
            value: ''
          }
        ]
      )
    )

    expect(result.mapping.passNumber).toBe('Sheet1#form#0#0')
  })

  it('drops form field candidates below the minimum similarity threshold', async () => {
    const { acceptsAutomaticHeaderMatch, headerMatchPolicy, matchColumns } =
      await import('./match-columns')

    expect(acceptsAutomaticHeaderMatch(0.49)).toBe(false)
    expect(acceptsAutomaticHeaderMatch(0.5)).toBe(true)

    vi.spyOn(headerMatchPolicy, 'accepts').mockReturnValue(false)

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
            label: 'Pass-Nr.',
            value: 'JP-1'
          }
        ]
      )
    )

    expect(result.mapping.passNumber).toBeUndefined()
  })
})
