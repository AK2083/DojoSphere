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

describe('email column matching', () => {
  it('maps table E-Mail Vereinsverantwortlicher column to club contact email', () => {
    const result = matchColumns(
      workbook([
        column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
        column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] }),
        column({
          id: 'Sheet1#2',
          header: 'E-Mail Vereinsverantwortlicher',
          values: ['kontakt@example-dojo.invalid', 'anmeldung@example-jc.invalid']
        })
      ])
    )

    expect(result.mapping.clubContactEmail).toBe('Sheet1#2')
    expect(result.mapping.remarks).toBeUndefined()
  })

  it('maps a form E-Mail field to club contact email instead of remarks', () => {
    const result = matchColumns(
      workbook(
        [
          column({ id: 'Sheet1#0', header: 'Vorname', values: ['Yuki'] }),
          column({ id: 'Sheet1#1', header: 'Nachname', values: ['Tanaka'] })
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

    expect(result.mapping.clubContactEmail).toBe('Sheet1#form#0#0')
    expect(result.mapping.remarks).toBeUndefined()
  })
})
