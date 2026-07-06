import {
  COMPETITOR_IMPORT_SYNONYMS_DE,
  COMPETITOR_IMPORT_SYNONYMS_EN
} from '@shared/domain/competitor-import-fields'
import * as XLSX from 'xlsx'

import { normalizeHeader } from './normalize-text'
import { type ParsedFormField, parseFormFields } from './parse-form-fields'

/** Number of leading rows scanned when detecting a sheet header row. */
const MAX_HEADER_SCAN_ROWS = 15

/** Number of sample values collected per column for the data-based fallback. */
const SAMPLE_VALUE_COUNT = 20

/** A single detected source column with its data values. */
export type ParsedColumn = {
  /** Unique id across the workbook (`<sheet>#<columnIndex>`). */
  id: string
  sheetName: string
  columnIndex: number
  header: string
  /** Data cell values below the header, aligned by row index within the sheet. */
  values: string[]
}

/** Result of parsing an uploaded workbook. */
export type ParsedWorkbook = {
  sheetNames: string[]
  columns: ParsedColumn[]
  formFields: ParsedFormField[]
}

/**
 * Returns whether a mapping source id refers to a registration form field.
 *
 * @param sourceId - Mapping source id from preview or user selection.
 * @returns `true` when the id points to a parsed form header field.
 */
export function isFormSourceId(sourceId: string): boolean {
  return sourceId.includes('#form#')
}

const KNOWN_HEADER_KEYS: ReadonlySet<string> = new Set(
  [...Object.values(COMPETITOR_IMPORT_SYNONYMS_DE), ...Object.values(COMPETITOR_IMPORT_SYNONYMS_EN)]
    .flat()
    .map(normalizeHeader)
    .filter(Boolean)
)

/**
 * Converts a workbook cell value to a trimmed string.
 *
 * @param value - Raw cell value.
 * @returns String representation suitable for import parsing.
 */
export function cellToString(value: unknown): string {
  if (value == null) {
    return ''
  }

  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return String(value).trim()
}

function countNonEmpty(row: string[]): number {
  return row.filter((cell) => cell.length > 0).length
}

function countHeaderMatches(row: string[]): number {
  return row.filter((cell) => KNOWN_HEADER_KEYS.has(normalizeHeader(cell))).length
}

/**
 * Detects the most likely header row index in normalized sheet rows.
 *
 * @param rows - Normalized sheet rows.
 * @returns Zero-based header row index.
 * @internal Exported for unit tests.
 */
export function detectHeaderRowIndex(rows: string[][]): number {
  let bestIndex = -1
  let bestScore = -1
  let bestNonEmpty = -1

  const scanLimit = Math.min(rows.length, MAX_HEADER_SCAN_ROWS)

  for (let index = 0; index < scanLimit; index += 1) {
    const row = rows[index] ?? []
    const matches = countHeaderMatches(row)
    const nonEmpty = countNonEmpty(row)

    if (matches > bestScore || (matches === bestScore && nonEmpty > bestNonEmpty)) {
      bestScore = matches
      bestNonEmpty = nonEmpty
      bestIndex = index
    }
  }

  if (bestScore <= 0) {
    for (let index = 0; index < rows.length; index += 1) {
      if (countNonEmpty(rows[index] ?? []) >= 2) {
        return index
      }
    }
  }

  if (bestIndex >= 0) {
    return bestIndex
  }

  return 0
}

/**
 * Builds parsed columns from normalized sheet rows.
 *
 * @internal Exported for unit tests.
 * @param sheetName - Worksheet name.
 * @param rows - Normalized sheet rows.
 * @param headerRowIndex
 * @returns Parsed columns for the detected header row.
 */
export function buildSheetColumnsFromRows(
  sheetName: string,
  rows: string[][],
  headerRowIndex = detectHeaderRowIndex(rows)
): ParsedColumn[] {
  const headerRow = rows[headerRowIndex] ?? []
  const dataRows = rows.slice(headerRowIndex + 1)
  const columnCount = rows.reduce((max, row) => Math.max(max, row?.length ?? 0), 0)
  const columns: ParsedColumn[] = []

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const header = (headerRow[columnIndex] ?? '').trim()
    const values = dataRows.map((row) => row[columnIndex] ?? '')

    if (!header && values.every((value) => value.length === 0)) {
      continue
    }

    columns.push({
      id: `${sheetName}#${columnIndex}`,
      sheetName,
      columnIndex,
      header,
      values
    })
  }

  return columns
}

function parseSheet(
  sheetName: string,
  sheet: XLSX.WorkSheet
): { columns: ParsedColumn[]; formFields: ParsedFormField[] } {
  const rows = XLSX.utils
    .sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false, defval: '' })
    .map((row) => (Array.isArray(row) ? row.map(cellToString) : []))

  if (rows.length === 0) {
    return { columns: [], formFields: [] }
  }

  const headerRowIndex = detectHeaderRowIndex(rows)
  const formFields = parseFormFields(rows, headerRowIndex, sheetName)
  const columns = buildSheetColumnsFromRows(sheetName, rows)

  return { columns, formFields }
}

/**
 * Parses an uploaded Excel workbook into normalized columns across all sheets.
 *
 * @param buffer - Raw file contents of the uploaded workbook.
 * @returns Sheet names and the flattened columns with their data values.
 */
export function parseWorkbook(buffer: ArrayBuffer | Uint8Array): ParsedWorkbook {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  const workbook = XLSX.read(data, { type: 'array', cellDates: true })

  const columns: ParsedColumn[] = []
  const formFields: ParsedFormField[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]

    if (!sheet) {
      continue
    }

    const parsed = parseSheet(sheetName, sheet)
    columns.push(...parsed.columns)
    formFields.push(...parsed.formFields)
  }

  return { sheetNames: [...workbook.SheetNames], columns, formFields }
}

/**
 * Returns up to {@link SAMPLE_VALUE_COUNT} non-empty sample values for a column.
 *
 * @param column - Parsed column to sample.
 * @returns Non-empty sample values for preview and data-type inference.
 */
export function sampleColumnValues(column: ParsedColumn): string[] {
  return column.values.filter((value) => value.length > 0).slice(0, SAMPLE_VALUE_COUNT)
}
