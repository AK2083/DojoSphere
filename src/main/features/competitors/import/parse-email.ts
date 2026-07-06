import { normalizeHeader, normalizeValue } from './normalize-text'

const EMAIL_VALUE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Returns whether a header label refers to an email address field.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to an email field.
 */
export function isEmailHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  return normalized.includes('email') || normalized.includes('mail') || normalized.includes('epost')
}

/**
 * Returns whether a cell value looks like an email address.
 *
 * @param value - Raw cell text.
 * @returns True when the value looks like an email address.
 */
export function isEmailValue(value: string): boolean {
  const compact = normalizeValue(value).replace(/\s+/g, '')

  return EMAIL_VALUE_PATTERN.test(compact)
}
