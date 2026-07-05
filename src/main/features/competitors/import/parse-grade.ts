import { normalizeHeader, normalizeValue } from './normalize-text'

/**
 *
 */
export type ParsedGrade = {
  levelType: 'dan' | 'kyu'
  levelNumber: number
}

const GRADE_CODE_PATTERN = /^(kyu|dan)[- ]?(\d{1,2})$/

const GRADE_WORD_PATTERN = /(\d{1,2})\s*\.?\s*(kyu|dan)\b/

/**
 * Parses a cell value such as `8. Kyu`, `3 Dan`, or `kyu-8` into level metadata.
 *
 * @param value - Raw grade cell text from Excel.
 * @returns Parsed kyu/dan level or undefined when the value is not recognized.
 */
export function parseGradeText(value: string): ParsedGrade | undefined {
  const compact = normalizeValue(value).replace(/\s+/g, ' ')

  if (!compact) {
    return undefined
  }

  const codeMatch = GRADE_CODE_PATTERN.exec(compact)

  if (codeMatch) {
    return toParsedGrade(codeMatch[1]!, codeMatch[2]!)
  }

  const wordMatch = GRADE_WORD_PATTERN.exec(compact)

  if (wordMatch) {
    return toParsedGrade(wordMatch[2]!, wordMatch[1]!)
  }

  return undefined
}

/**
 * Parses a grade cell, using the column header when the value is only a number.
 *
 * Excel sheets often label the column `Kyu` but store bare values such as `8.`.
 *
 * @param value - Raw grade cell text from Excel.
 * @param header - Optional column header used to infer kyu vs dan.
 * @returns Parsed kyu/dan level or undefined when the value is not recognized.
 */
export function parseGradeFromCell(value: string, header?: string): ParsedGrade | undefined {
  const parsed = parseGradeText(value)

  if (parsed) {
    return parsed
  }

  if (!header || !isGradeHeader(header)) {
    return undefined
  }

  const numberMatch = /^(\d{1,2})\.?$/.exec(value.trim())

  if (!numberMatch) {
    return undefined
  }

  const normalizedHeader = normalizeHeader(header)
  const levelType = normalizedHeader.includes('dan') ? 'dan' : 'kyu'

  return toParsedGrade(levelType, numberMatch[1]!)
}

/**
 * Returns whether a sample value looks like a judo grade (kyu or dan).
 *
 * @param value - Raw cell text.
 * @returns `true` when {@link parseGradeText} would succeed.
 */
export function isGradeValue(value: string): boolean {
  return parseGradeText(value) !== undefined
}

/**
 * Returns whether a header label likely refers to a grade column.
 *
 * @param header - Column header text.
 * @returns `true` for labels such as Kyu, Dan, or Gürtel.
 */
export function isGradeHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  return (
    normalized.includes('kyu') ||
    normalized.includes('dan') ||
    normalized.includes('gurtel') ||
    normalized.includes('gurt') ||
    normalized === 'grad' ||
    normalized.includes('belt') ||
    normalized.includes('grade')
  )
}

/**
 * Builds a parsed grade from raw level type and number strings.
 *
 * @param levelTypeRaw - Raw level type (`kyu` or `dan`).
 * @param levelNumberRaw - Raw level number.
 * @returns Parsed grade or `undefined` when invalid.
 */
function toParsedGrade(levelTypeRaw: string, levelNumberRaw: string): ParsedGrade | undefined {
  const levelType = levelTypeRaw === 'dan' ? 'dan' : levelTypeRaw === 'kyu' ? 'kyu' : undefined
  const levelNumber = Number(levelNumberRaw)

  if (!levelType || !Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) {
    return undefined
  }

  return { levelType, levelNumber }
}

/** @internal Exported for unit tests. */
export const parseGradeLevel = toParsedGrade
