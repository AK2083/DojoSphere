import { describe, expect, it } from 'vitest'

import { parseFormFields } from './parse-form-fields'

describe('parseFormFields', () => {
  it('extracts label/value pairs from rows above the table header', () => {
    const rows = [
      ['Ausrichter', 'Judo-Club Musterstadt', 'Meldeschluss', '05.09.2026'],
      ['Veranstaltung', 'Musterstadt Nachwuchs', 'Wettkampftag', '19.09.2026'],
      ['Meldender Verein', 'TSV Beispielhausen', 'Kontaktperson', 'Anna Trainerin'],
      ['E-Mail', 'anna@beispielhausen.de', 'Telefon', '+49 170 1234567'],
      ['Nr.', 'Nachname', 'Vorname', 'Geburtsjahr'],
      ['1', 'Bauer', 'Lina', '2012']
    ]

    const fields = parseFormFields(rows, 4, 'Meldeformular')

    expect(fields).toHaveLength(8)
    expect(fields[0]).toMatchObject({
      label: 'Ausrichter',
      value: 'Judo-Club Musterstadt',
      id: 'Meldeformular#form#0#0'
    })
    expect(fields.find((field) => field.label === 'Meldeschluss')?.value).toBe('05.09.2026')
    expect(fields.find((field) => field.label === 'Telefon')?.value).toBe('+49 170 1234567')
  })

  it('skips long note rows and duplicate labels', () => {
    const rows = [
      [
        'Beispieldaten sind vollständig fiktiv und dienen nur zur Demonstration der Spaltenzuordnung.'
      ],
      ['Ausrichter', 'Dojo Nord'],
      ['Ausrichter', 'Duplicate'],
      ['Vorname', 'Nachname']
    ]

    const fields = parseFormFields(rows, 3, 'Sheet1')

    expect(fields).toEqual([expect.objectContaining({ label: 'Ausrichter', value: 'Dojo Nord' })])
  })

  it('skips implausible labels and values', () => {
    const longLabel = 'Label '.repeat(20)
    const manyWords = 'one two three four five six seven eight nine'
    const rows = [
      ['', 'value'],
      [longLabel, 'value'],
      [manyWords, 'value'],
      ['Valid', ''],
      ['Valid', 'ok'],
      ['OnlyLabel'],
      ['Vorname', 'Nachname']
    ]

    const fields = parseFormFields(rows, 6, 'Sheet1')

    expect(fields).toEqual([expect.objectContaining({ label: 'Valid', value: 'ok' })])
  })

  it('tolerates sparse rows and missing cells', () => {
    const rows: string[][] = []
    rows[0] = undefined as unknown as string[]
    rows[1] = ['OnlyLabel']
    rows[2] = [undefined as unknown as string, undefined as unknown as string]
    rows[3] = ['Valid', 'ok']
    rows[4] = ['Vorname', 'Nachname']

    const fields = parseFormFields(rows, 4, 'Sheet1')

    expect(fields).toEqual([expect.objectContaining({ label: 'Valid', value: 'ok' })])
  })
})
