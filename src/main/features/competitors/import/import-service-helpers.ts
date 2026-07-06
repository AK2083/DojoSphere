import type { TransformedParticipant } from './transform-row'

/**
 * Normalizes optional import values to `null` for repository input.
 *
 * @param value - Optional field value from a transformed participant row.
 * @returns The value or `null` when it is missing.
 */
export function toImportNullable<T>(value: T | null | undefined): T | null {
  if (value === undefined || value === null) {
    return null
  }

  return value
}

/**
 * Returns a stable label for import result rows.
 *
 * @param participant - Transformed participant for the row, if present.
 * @param field - Participant field to expose in the result summary.
 * @returns Trimmed field text or an empty string.
 */
export function importResultRowLabel(
  participant: TransformedParticipant | undefined,
  field: 'givenName' | 'familyName' | 'club'
): string {
  if (!participant) {
    return ''
  }

  const value = participant[field]

  if (value === undefined || value === null) {
    return ''
  }

  return value
}

/**
 * Returns whether a transformed row carries a weight value.
 *
 * @param weightKg - Parsed weight in kilograms.
 * @returns True when a weight class should be resolved.
 */
export function hasImportWeight(weightKg: number | undefined): boolean {
  return weightKg !== undefined && weightKg !== null
}

/**
 * Returns whether an import row succeeded.
 *
 * @param rowResult - Repository result for a single imported row.
 * @returns True when the row was persisted successfully.
 */
export function isImportRowSuccessful(rowResult: { success: boolean } | undefined): boolean {
  return rowResult?.success === true
}
