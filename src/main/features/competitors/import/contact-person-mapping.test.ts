import { describe, expect, it } from 'vitest'

import { matchColumns } from './match-columns'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'

function column(id: string, header: string, values: string[]): ParsedColumn {
  return { id, sheetName: 'Meldeformular', columnIndex: Number(id.split('#')[1]), header, values }
}

function workbook(
  columns: ParsedColumn[],
  formFields: ParsedWorkbook['formFields'] = []
): ParsedWorkbook {
  return { sheetNames: ['Meldeformular'], columns, formFields }
}

describe('contact person mapping priority', () => {
  it('prefers participant table column over registration form Kontaktperson', () => {
    const result = matchColumns(
      workbook(
        [
          column('Meldeformular#0', 'Vorname', ['Lina', 'Max']),
          column('Meldeformular#1', 'Nachname', ['Bauer', 'Klein']),
          column('Meldeformular#2', 'Coach / Kontakt am Wettkampftag', ['Trainer A', 'Trainer B'])
        ],
        [
          {
            id: 'Meldeformular#form#0#2',
            sheetName: 'Meldeformular',
            label: 'Kontaktperson',
            value: 'Anna Trainerin'
          }
        ]
      )
    )

    expect(result.mapping.contactPerson).toBe('Meldeformular#2')
  })
})
