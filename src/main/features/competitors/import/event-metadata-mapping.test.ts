import { describe, expect, it } from 'vitest'

import { matchColumns } from './match-columns'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'

function column(id: string, header: string, values: string[]): ParsedColumn {
  return { id, sheetName: 'S', columnIndex: 0, header, values }
}

function workbook(
  columns: ParsedColumn[],
  formFields: ParsedWorkbook['formFields'] = []
): ParsedWorkbook {
  return { sheetNames: ['S'], columns, formFields }
}

describe('event metadata vs participant fields', () => {
  it('does not map Wettkampftag form field to licenseNumber or birthDate', () => {
    const result = matchColumns(
      workbook(
        [column('S#0', 'Vorname', ['Lina']), column('S#1', 'Nachname', ['Bauer'])],
        [
          {
            id: 'S#form#0#2',
            sheetName: 'S',
            label: 'Wettkampftag',
            value: '19.09.2026'
          }
        ]
      )
    )

    expect(result.mapping.licenseNumber).toBeUndefined()
    expect(result.mapping.birthDate).toBeUndefined()
  })

  it('does not map Wettkampflizenznummer column when values are dates', () => {
    const result = matchColumns(
      workbook([
        column('S#0', 'Vorname', ['Lina']),
        column('S#1', 'Nachname', ['Bauer']),
        column('S#2', 'Wettkampflizenznummer', ['19.09.2026', '20.09.2026'])
      ])
    )

    expect(result.mapping.licenseNumber).toBeUndefined()
    expect(result.mapping.birthDate).toBeUndefined()
  })

  it('maps Wettkampflizenznummer when values look like license numbers', () => {
    const result = matchColumns(
      workbook([
        column('S#0', 'Vorname', ['Lina']),
        column('S#1', 'Nachname', ['Bauer']),
        column('S#2', 'Wettkampflizenznummer', ['WL-12345', 'WL-67890'])
      ])
    )

    expect(result.mapping.licenseNumber).toBe('S#2')
  })

  it('does not map Wettkampftag date column to licenseNumber', () => {
    const result = matchColumns(
      workbook([
        column('S#0', 'Vorname', ['Lina']),
        column('S#1', 'Nachname', ['Bauer']),
        column('S#2', 'Wettkampftag', ['19.09.2026', '20.09.2026'])
      ])
    )

    expect(result.mapping.licenseNumber).toBeUndefined()
    expect(result.mapping.birthDate).toBeUndefined()
  })
})
