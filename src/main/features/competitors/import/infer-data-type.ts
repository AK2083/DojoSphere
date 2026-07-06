import {
  BOOLEAN_FALSE_SYNONYMS,
  BOOLEAN_TRUE_SYNONYMS,
  GENDER_VALUE_SYNONYMS,
  type ImportFieldDataType,
  REGISTRATION_STATUS_VALUE_SYNONYMS
} from '@shared/domain/competitor-import-fields'

import { normalizeValue } from './normalize-text'
import { isEmailHeader, isEmailValue } from './parse-email'
import { isGradeHeader, isGradeValue } from './parse-grade'

const GENDER_VALUES: ReadonlySet<string> = new Set(
  Object.values(GENDER_VALUE_SYNONYMS).flat().map(normalizeValue)
)

const STATUS_VALUES: ReadonlySet<string> = new Set(
  Object.values(REGISTRATION_STATUS_VALUE_SYNONYMS).flat().map(normalizeValue)
)

const BOOLEAN_VALUES: ReadonlySet<string> = new Set(
  [...BOOLEAN_TRUE_SYNONYMS, ...BOOLEAN_FALSE_SYNONYMS].map(normalizeValue)
)

const YEAR_PATTERN = /^(19|20)\d{2}$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DMY_DATE_PATTERN = /^\d{1,2}[./]\d{1,2}[./]\d{2,4}$/
const NATIONALITY_PATTERN = /^[a-z]{2}$/

/**
 * Share of sample values that satisfy a predicate.
 *
 * @param values - Sample cell values.
 * @param predicate - Value matcher.
 * @returns Ratio between 0 and 1.
 */
function matchesRatio(values: string[], predicate: (value: string) => boolean): number {
  if (values.length === 0) {
    return 0
  }

  const matches = values.filter(predicate).length

  return matches / values.length
}

/** @internal Exported for unit tests. */
export const matchesSampleRatio = matchesRatio

function isDateValue(value: string): boolean {
  return ISO_DATE_PATTERN.test(value) || DMY_DATE_PATTERN.test(value) || YEAR_PATTERN.test(value)
}

function isGradeSampleValue(value: string, header?: string): boolean {
  return (
    isGradeValue(value) ||
    Boolean(header && isGradeHeader(header) && /^(\d{1,2})\.?$/.test(value.trim()))
  )
}

function isWeightKgValue(value: string): boolean {
  const numeric = Number(value.replace(',', '.'))

  return Number.isFinite(numeric) && numeric >= 20 && numeric <= 250
}

/**
 * Infers the most likely data type of a column from sample cell values.
 *
 * Used as a fallback when header matching cannot map a column. The most specific
 * type that a majority of samples satisfy wins.
 *
 * @param samples - Non-empty sample cell values.
 * @param header - Optional column header used for grade-specific inference.
 * @returns The inferred data type, or `text` when no specific type dominates.
 */
export function inferColumnDataType(samples: string[], header?: string): ImportFieldDataType {
  const values = samples.map(normalizeValue).filter(Boolean)

  if (values.length === 0) {
    return 'text'
  }

  const threshold = 0.7

  if (matchesRatio(values, (value) => GENDER_VALUES.has(value)) >= threshold) {
    return 'gender'
  }

  if (matchesRatio(values, (value) => STATUS_VALUES.has(value)) >= threshold) {
    return 'registrationStatus'
  }

  if (matchesRatio(values, (value) => isGradeSampleValue(value, header)) >= threshold) {
    return 'grade'
  }

  if (isEmailHeader(header ?? '') || matchesRatio(values, isEmailValue) >= threshold) {
    return 'email'
  }

  if (matchesRatio(values, isDateValue) >= threshold) {
    return 'date'
  }

  if (matchesRatio(values, (value) => NATIONALITY_PATTERN.test(value)) >= threshold) {
    return 'nationality'
  }

  if (matchesRatio(values, (value) => BOOLEAN_VALUES.has(value)) >= threshold) {
    return 'boolean'
  }

  if (matchesRatio(values, isWeightKgValue) >= threshold) {
    return 'weightKg'
  }

  return 'text'
}
