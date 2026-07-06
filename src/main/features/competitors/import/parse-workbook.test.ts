import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'

import { parseWorkbook, sampleColumnValues, isFormSourceId, cellToString } from './parse-workbook'

function buildWorkbook(sheets: Record<string, unknown[][]>): ArrayBuffer {
  const workbook = XLSX.utils.book_new()

  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name)
  }

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

describe('parseWorkbook', () => {
  it('detects the header row after title and reads columns with values', () => {
    const buffer = buildWorkbook({
      Teilnehmer: [
        ['Meldeliste Turnier 2026'],
        ['Vorname', 'Nachname', 'Verein'],
        ['Yuki', 'Tanaka', 'Dojo Nord'],
        ['Anna', 'Weber', 'Dojo Süd']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.sheetNames).toEqual(['Teilnehmer'])
    expect(workbook.columns).toHaveLength(3)
    expect(workbook.formFields).toEqual([])

    const [given, family, club] = workbook.columns

    expect(given?.header).toBe('Vorname')
    expect(given?.values).toEqual(['Yuki', 'Anna'])
    expect(family?.header).toBe('Nachname')
    expect(club?.values).toEqual(['Dojo Nord', 'Dojo Süd'])
    expect(given?.id).toBe('Teilnehmer#0')
  })

  it('extracts registration form fields above the participant table', () => {
    const buffer = buildWorkbook({
      Meldeformular: [
        ['Ausrichter', 'Judo-Club Musterstadt', 'Meldeschluss', '05.09.2026'],
        ['Veranstaltung', 'Musterstadt Nachwuchs', 'Wettkampftag', '19.09.2026'],
        ['Nr.', 'Nachname', 'Vorname', 'Geburtsjahr'],
        ['1', 'Bauer', 'Lina', '2012']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.formFields.map((field) => field.label)).toEqual([
      'Ausrichter',
      'Meldeschluss',
      'Veranstaltung',
      'Wettkampftag'
    ])
    expect(workbook.formFields[0]?.value).toBe('Judo-Club Musterstadt')
  })

  it('normalizes dates, numbers and booleans to strings', () => {
    const buffer = buildWorkbook({
      Data: [
        ['Geburtsdatum', 'Jahrgang', 'Startberechtigt'],
        [new Date(2012, 3, 5, 12, 0, 0), 2012, true]
      ]
    })

    const workbook = parseWorkbook(buffer)
    const [birth, year, eligible] = workbook.columns

    expect(birth?.values[0]).toBe('2012-04-05')
    expect(year?.values[0]).toBe('2012')
    expect(eligible?.values[0]).toBe('true')
  })

  it('falls back to the first dense row when no known headers exist', () => {
    const buffer = buildWorkbook({
      Sheet1: [
        ['alpha', 'beta'],
        ['1', '2']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns.map((column) => column.header)).toEqual(['alpha', 'beta'])
  })

  it('collects columns from every sheet', () => {
    const buffer = buildWorkbook({
      Teilnehmer: [
        ['Vorname', 'Nachname'],
        ['Yuki', 'Tanaka']
      ],
      Vereine: [
        ['Verein', 'Trainer'],
        ['Dojo Nord', 'S. Fischer']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.sheetNames).toEqual(['Teilnehmer', 'Vereine'])
    expect(workbook.columns.map((column) => column.sheetName)).toEqual([
      'Teilnehmer',
      'Teilnehmer',
      'Vereine',
      'Vereine'
    ])
  })

  it('skips completely empty columns and empty sheets', () => {
    const buffer = buildWorkbook({
      Empty: [],
      Data: [
        ['Vorname', '', 'Nachname'],
        ['Yuki', '', 'Tanaka']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns.map((column) => column.header)).toEqual(['Vorname', 'Nachname'])
  })

  it('normalizes null and false cell values', () => {
    const buffer = buildWorkbook({
      Data: [
        ['Flag', 'Empty'],
        [false, null]
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns[0]?.values[0]).toBe('false')
    expect(workbook.columns[1]?.values[0]).toBe('')
  })

  it('accepts Uint8Array workbook buffers', () => {
    const buffer = buildWorkbook({
      Data: [
        ['Vorname', 'Nachname'],
        ['Yuki', 'Tanaka']
      ]
    })

    expect(parseWorkbook(new Uint8Array(buffer)).columns).toHaveLength(2)
  })

  it('keeps columns with values even when the header cell is empty', () => {
    const buffer = buildWorkbook({
      Data: [
        ['', 'Nachname'],
        ['Yuki', 'Tanaka']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns.map((column) => column.header)).toEqual(['', 'Nachname'])
    expect(workbook.columns[0]?.values).toEqual(['Yuki'])
  })

  it('falls back to the first dense row when no known headers are present', () => {
    const buffer = buildWorkbook({
      Data: [['title only'], ['alpha', 'beta'], ['1', '2']]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns.map((column) => column.header)).toEqual(['alpha', 'beta'])
  })

  it('uses the first row when no header or dense row can be detected', () => {
    const buffer = buildWorkbook({
      Data: [['only-one-column'], ['value']]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns[0]?.header).toBe('only-one-column')
  })

  it('fills missing header and data cells when rows are ragged', () => {
    const buffer = buildWorkbook({
      Data: [['Vorname', 'Nachname'], ['Yuki'], ['Anna', 'Weber', 'ignored-extra']]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns[0]?.values).toEqual(['Yuki', 'Anna'])
    expect(workbook.columns[1]?.values).toEqual(['', 'Weber'])
  })

  it('uses the dense-row fallback when no header synonyms are present', () => {
    const buffer = buildWorkbook({
      Notes: [['title only'], ['alpha', 'beta', 'gamma'], ['1', '2', '3']]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns.map((column) => column.header)).toEqual(['alpha', 'beta', 'gamma'])
  })

  it('skips columns that have neither a header nor values', () => {
    const buffer = buildWorkbook({
      Data: [
        ['Vorname', '', 'Nachname'],
        ['Yuki', '', 'Tanaka']
      ]
    })

    const workbook = parseWorkbook(buffer)

    expect(workbook.columns).toHaveLength(2)
  })
})

describe('detectHeaderRowIndex', () => {
  it('handles sparse rows and missing header cells', async () => {
    const { buildSheetColumnsFromRows, detectHeaderRowIndex } = await import('./parse-workbook')
    const rows: string[][] = []
    rows[1] = ['alpha', 'beta']
    rows[2] = ['1', '2']

    expect(detectHeaderRowIndex(rows)).toBe(1)
    expect(detectHeaderRowIndex([['only-one']])).toBe(0)
    expect(detectHeaderRowIndex([])).toBe(0)
    expect(detectHeaderRowIndex([[''], ['']])).toBe(0)
    expect(
      detectHeaderRowIndex([
        ['Vorname', 'Nachname'],
        ['Yuki', 'Tanaka']
      ])
    ).toBe(0)

    const sparseRows: string[][] = [
      ['title'],
      undefined as unknown as string[],
      ['Vorname', 'Nachname'],
      ['Yuki']
    ]
    const columns = buildSheetColumnsFromRows('Sheet1', sparseRows)

    expect(columns[0]?.values).toEqual(['Yuki'])
    expect(columns[1]?.values).toEqual([''])

    const forcedColumns = buildSheetColumnsFromRows(
      'Sheet1',
      [['title'], undefined as unknown as string[], ['Yuki', 'Tanaka']],
      1
    )

    expect(forcedColumns[0]?.header).toBe('')
    expect(forcedColumns[1]?.values).toEqual(['Tanaka'])
  })
})

describe('isFormSourceId', () => {
  it('detects registration form source ids', () => {
    expect(isFormSourceId('Sheet1#form#0#0')).toBe(true)
    expect(isFormSourceId('Sheet1#0')).toBe(false)
  })
})

describe('cellToString', () => {
  it('normalizes nullish and boolean values', () => {
    expect(cellToString(null)).toBe('')
    expect(cellToString(undefined)).toBe('')
    expect(cellToString(false)).toBe('false')
  })
})

describe('sampleColumnValues', () => {
  it('returns non-empty values capped at the sample limit', () => {
    const values = Array.from({ length: 30 }, (_, index) => (index % 2 === 0 ? `v${index}` : ''))

    const samples = sampleColumnValues({
      id: 'Sheet1#0',
      sheetName: 'Sheet1',
      columnIndex: 0,
      header: 'H',
      values
    })

    expect(samples.length).toBe(15)
    expect(samples.every((value) => value.length > 0)).toBe(true)
  })
})
