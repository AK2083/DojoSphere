import { normalizeHeader } from './normalize-text'

/** A single key-value field from the registration form header area. */
export type ParsedFormField = {
  /** Unique id across the workbook (`<sheet>#form#<row>#<col>`). */
  id: string
  sheetName: string
  label: string
  value: string
}

const MAX_LABEL_LENGTH = 60
const MAX_VALUE_LENGTH = 200
const MAX_LABEL_WORDS = 8

function isPlausibleFormLabel(label: string): boolean {
  if (!label || label.length > MAX_LABEL_LENGTH) {
    return false
  }

  if (label.split(/\s+/).length > MAX_LABEL_WORDS) {
    return false
  }

  return true
}

function isPlausibleFormValue(value: string): boolean {
  return value.length > 0 && value.length <= MAX_VALUE_LENGTH
}

/**
 * Extracts label/value pairs from rows above the participant table header.
 *
 * German registration forms typically lay out pairs as label | value | label | value
 * on each row (e.g. Ausrichter / Judo-Club … / Meldeschluss / 05.09.2026).
 *
 * @param rows - Normalized sheet rows.
 * @param headerRowIndex - Detected index of the participant table header row.
 * @param sheetName - Sheet name for stable ids.
 * @returns Parsed form fields with a single constant value each.
 */
export function parseFormFields(
  rows: string[][],
  headerRowIndex: number,
  sheetName: string
): ParsedFormField[] {
  const fields: ParsedFormField[] = []
  const seenLabels = new Set<string>()

  for (let rowIndex = 0; rowIndex < headerRowIndex; rowIndex += 1) {
    const row = rows[rowIndex] ?? []

    for (let columnIndex = 0; columnIndex < row.length - 1; columnIndex += 2) {
      const label = (row[columnIndex] ?? '').trim().replace(/:$/, '')
      const value = (row[columnIndex + 1] ?? '').trim()

      if (!isPlausibleFormLabel(label) || !isPlausibleFormValue(value)) {
        continue
      }

      const normalizedLabel = normalizeHeader(label)

      if (!normalizedLabel || seenLabels.has(normalizedLabel)) {
        continue
      }

      seenLabels.add(normalizedLabel)
      fields.push({
        id: `${sheetName}#form#${rowIndex}#${columnIndex}`,
        sheetName,
        label,
        value
      })
    }
  }

  return fields
}
