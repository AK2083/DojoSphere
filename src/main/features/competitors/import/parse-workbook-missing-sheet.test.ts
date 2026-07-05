import * as XLSX from 'xlsx'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const readMock = vi.hoisted(() => vi.fn())

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('xlsx')>()

  return {
    ...actual,
    read: (...args: Parameters<typeof actual.read>) => readMock(...args) ?? actual.read(...args)
  }
})

describe('parseWorkbook missing sheet objects', () => {
  beforeEach(() => {
    readMock.mockReset()
  })

  it('skips sheet names without a worksheet entry', async () => {
    readMock.mockReturnValue({
      SheetNames: ['Missing', 'Present'],
      Sheets: {
        Present: XLSX.utils.aoa_to_sheet([
          ['Vorname', 'Nachname'],
          ['Yuki', 'Tanaka']
        ])
      }
    })

    const { parseWorkbook } = await import('./parse-workbook')
    const workbook = parseWorkbook(new ArrayBuffer(8))

    expect(workbook.sheetNames).toEqual(['Missing', 'Present'])
    expect(workbook.columns).toHaveLength(2)
  })

  it('ignores malformed worksheet rows that are not arrays', async () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ['Vorname', 'Nachname'],
      ['Yuki', 'Tanaka']
    ])
    const sheetToJson = vi
      .spyOn(XLSX.utils, 'sheet_to_json')
      .mockReturnValueOnce([
        ['Vorname', 'Nachname'],
        undefined,
        ['Yuki'],
        ['Anna', 'Weber']
      ] as never)

    readMock.mockReturnValue({
      SheetNames: ['Broken'],
      Sheets: { Broken: sheet }
    })

    const { parseWorkbook } = await import('./parse-workbook')
    const workbook = parseWorkbook(new ArrayBuffer(8))

    expect(workbook.columns.map((column) => column.header)).toEqual(['Vorname', 'Nachname'])

    sheetToJson.mockRestore()
  })
})
