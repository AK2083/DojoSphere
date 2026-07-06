import type { Database } from '@main/shared/database'
import { DEFAULT_BIRTH_DATE, DEFAULT_PASS_NUMBER } from '@main/shared/database/reference-seed-ids'

/** Stable error message when a participant already exists. */
export const DUPLICATE_COMPETITOR_ERROR = 'duplicate_competitor'

/** Stable import row error when the same participant appears twice in one file. */
export const DUPLICATE_IN_IMPORT_ERROR = 'duplicate_in_import'

/** Fields used to detect duplicate participants. */
export type CompetitorDuplicateInput = {
  givenName: string
  familyName: string
  birthDate?: string | null
  passNumber?: string | null
  licenseNumber?: string | null
}

type DuplicateKey =
  | { kind: 'pass_number'; value: string }
  | { kind: 'license_number'; value: string }
  | { kind: 'identity'; givenName: string; familyName: string; birthDate: string }

function normalizePassNumber(passNumber?: string | null): string {
  const trimmed = passNumber?.trim()

  return trimmed || DEFAULT_PASS_NUMBER
}

function normalizeBirthDate(birthDate?: string | null): string {
  const trimmed = birthDate?.trim()

  return trimmed || DEFAULT_BIRTH_DATE
}

function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim()

  return trimmed ? trimmed : null
}

/**
 * Builds duplicate lookup keys for a participant input.
 *
 * Pass numbers and license numbers are checked when present. When neither is
 * available, name and birth date form a fallback identity key.
 *
 * @param input - Participant fields to evaluate.
 * @returns Duplicate keys to compare against existing or in-file records.
 */
export function buildCompetitorDuplicateKeys(input: CompetitorDuplicateInput): DuplicateKey[] {
  const givenName = input.givenName.trim()
  const familyName = input.familyName.trim()
  const passNumber = normalizePassNumber(input.passNumber)
  const licenseNumber = normalizeOptionalText(input.licenseNumber)
  const birthDate = normalizeBirthDate(input.birthDate)
  const keys: DuplicateKey[] = []

  if (passNumber !== DEFAULT_PASS_NUMBER) {
    keys.push({ kind: 'pass_number', value: passNumber })
  }

  if (licenseNumber) {
    keys.push({ kind: 'license_number', value: licenseNumber })
  }

  if (passNumber === DEFAULT_PASS_NUMBER && !licenseNumber) {
    keys.push({ kind: 'identity', givenName, familyName, birthDate })
  }

  return keys
}

/**
 * Serializes a duplicate key for in-memory import batch tracking.
 *
 * @param key - Duplicate key to serialize.
 * @returns Stable string representation.
 */
export function serializeCompetitorDuplicateKey(key: DuplicateKey): string {
  switch (key.kind) {
    case 'pass_number':
      return `pass:${key.value}`
    case 'license_number':
      return `license:${key.value}`
    case 'identity':
      return `identity:${key.givenName.toLowerCase()}:${key.familyName.toLowerCase()}:${key.birthDate}`
  }
}

function findExistingByKey(
  db: Database,
  key: DuplicateKey,
  excludeCompetitorId?: string
): string | null {
  const excludedId = excludeCompetitorId ?? ''

  switch (key.kind) {
    case 'pass_number': {
      const row = db
        .prepare(`SELECT id FROM competitors WHERE pass_number = ? AND id != ? LIMIT 1`)
        .get(key.value, excludedId) as { id: string } | undefined

      return row?.id ?? null
    }
    case 'license_number': {
      const row = db
        .prepare(`SELECT id FROM competitors WHERE license_number = ? AND id != ? LIMIT 1`)
        .get(key.value, excludedId) as { id: string } | undefined

      return row?.id ?? null
    }
    case 'identity': {
      const row = db
        .prepare(
          `
          SELECT id
          FROM competitors
          WHERE lower(trim(given_name)) = lower(?)
            AND lower(trim(family_name)) = lower(?)
            AND birth_date = ?
            AND trim(pass_number) = ?
            AND (license_number IS NULL OR trim(license_number) = '')
            AND id != ?
          LIMIT 1
        `
        )
        .get(key.givenName, key.familyName, key.birthDate, DEFAULT_PASS_NUMBER, excludedId) as
        { id: string } | undefined

      return row?.id ?? null
    }
  }
}

/**
 * Returns the id of an existing duplicate participant, if any.
 *
 * @param db - Database connection.
 * @param input - Participant fields to evaluate.
 * @param excludeCompetitorId - Optional id to ignore during updates.
 * @returns Matching competitor id or null.
 */
export function findDuplicateCompetitorId(
  db: Database,
  input: CompetitorDuplicateInput,
  excludeCompetitorId?: string
): string | null {
  for (const key of buildCompetitorDuplicateKeys(input)) {
    const existingId = findExistingByKey(db, key, excludeCompetitorId)

    if (existingId) {
      return existingId
    }
  }

  return null
}

/**
 * Throws {@link DUPLICATE_COMPETITOR_ERROR} when a duplicate participant exists.
 *
 * @param db - Database connection.
 * @param input - Participant fields to evaluate.
 * @param excludeCompetitorId - Optional id to ignore during updates.
 */
export function assertNoDuplicateCompetitor(
  db: Database,
  input: CompetitorDuplicateInput,
  excludeCompetitorId?: string
): void {
  if (findDuplicateCompetitorId(db, input, excludeCompetitorId)) {
    throw new Error(DUPLICATE_COMPETITOR_ERROR)
  }
}
