import { describe, expect, it } from 'vitest'

import { matchColumns } from './match-columns'
import type { ParsedColumn, ParsedWorkbook } from './parse-workbook'
import { countParticipantRows } from './transform-row'

function column(id: string, header: string, values: string[]): ParsedColumn {
  return { id, sheetName: 'Teilnehmer', columnIndex: Number(id.split('#')[1]), header, values }
}

function workbook(columns: ParsedColumn[]): ParsedWorkbook {
  return { sheetNames: ['Teilnehmer'], columns, formFields: [] }
}

describe('club column mapping', () => {
  it('maps Verein/Club to club instead of Bereich', () => {
    const result = matchColumns(
      workbook([
        column('Teilnehmer#0', 'Vorname', ['Anna', 'Ben']),
        column('Teilnehmer#1', 'Nachname', ['Weber', 'Schulz']),
        column('Teilnehmer#2', 'Verein/Club', ['Dojo Nord', 'Dojo Süd']),
        column('Teilnehmer#3', 'Bereich', ['Ost', 'West'])
      ])
    )

    expect(result.mapping.club).toBe('Teilnehmer#2')
  })

  it('maps Meldender Verein column to club', () => {
    const result = matchColumns(
      workbook([
        column('Teilnehmer#0', 'Vorname', ['Anna']),
        column('Teilnehmer#1', 'Nachname', ['Weber']),
        column('Teilnehmer#2', 'Meldender Verein', ['TSV Beispielhausen'])
      ])
    )

    expect(result.mapping.club).toBe('Teilnehmer#2')
  })
})

describe('countParticipantRows', () => {
  it('counts only named rows on the primary sheet', () => {
    const wb = workbook([
      column('Teilnehmer#0', 'Vorname', ['Anna', 'Ben', '', '']),
      column('Teilnehmer#1', 'Nachname', ['Weber', 'Schulz', '', '']),
      column('Teilnehmer#2', 'Verein/Club', ['Dojo Nord', 'Dojo Süd', 'Meta', 'Meta'])
    ])

    const mapping = matchColumns(wb).mapping

    expect(countParticipantRows(wb, mapping)).toBe(2)
  })

  it('ignores rows from secondary sheets when counting participants', () => {
    const wb: ParsedWorkbook = {
      sheetNames: ['Teilnehmer', 'Vereine'],
      formFields: [],
      columns: [
        column('Teilnehmer#0', 'Vorname', ['Anna', 'Ben']),
        column('Teilnehmer#1', 'Nachname', ['Weber', 'Schulz']),
        {
          id: 'Vereine#0',
          sheetName: 'Vereine',
          columnIndex: 0,
          header: 'Verein',
          values: Array.from({ length: 13 }, (_, index) => `Club ${index + 1}`)
        }
      ]
    }

    const mapping = matchColumns(wb).mapping

    expect(countParticipantRows(wb, mapping)).toBe(2)
  })
})
