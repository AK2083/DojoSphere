import {
  COMPETITOR_COACH_MAX_LENGTH,
  COMPETITOR_CONTACT_PHONE_MAX_LENGTH,
  COMPETITOR_LICENSE_IDENTIFIER_PATTERN,
  COMPETITOR_LICENSE_NUMBER_MAX_LENGTH,
  COMPETITOR_NAME_MAX_LENGTH,
  COMPETITOR_PASS_NUMBER_MAX_LENGTH
} from '@shared/domain/competitor-field-limits'

import type { WeightClassSeed } from '../model/static-reference-data'

/** Canonical validation error codes for the participant form. */
export const ParticipantFormErrorCode = {
  REQUIRED: 'required',
  INVALID_GENDER: 'invalidGender',
  INVALID_BIRTH_DATE: 'invalidBirthDate',
  BIRTH_DATE_IN_FUTURE: 'birthDateInFuture',
  INVALID_NATIONALITY: 'invalidNationality',
  INVALID_PASS_NUMBER: 'invalidPassNumber',
  INVALID_PHONE: 'invalidPhone',
  TEXT_TOO_LONG: 'textTooLong',
  WEIGHT_CLASS_AGE_MISMATCH: 'weightClassAgeMismatch'
} as const

/** Validation error codes returned by participant form rules. */
export type ParticipantFormErrorCode =
  (typeof ParticipantFormErrorCode)[keyof typeof ParticipantFormErrorCode]

/** Result of a participant form validation rule. */
export type ParticipantFormRuleResult = true | ParticipantFormErrorCode

/**
 * Requires a non-empty trimmed text value.
 *
 * @param value - Field value to validate.
 * @returns `true` when valid, otherwise an error code.
 */
export function requiredFieldRule(value?: string | null): ParticipantFormRuleResult {
  return value?.trim() ? true : ParticipantFormErrorCode.REQUIRED
}

/**
 * Validates a participant gender code (`f`, `m`, or `d`).
 *
 * @param value - Selected gender value.
 * @returns `true` when valid, otherwise an error code.
 */
export function genderRule(value?: string | null): ParticipantFormRuleResult {
  if (value === 'f' || value === 'm' || value === 'd') {
    return true
  }

  return value?.trim() ? ParticipantFormErrorCode.INVALID_GENDER : ParticipantFormErrorCode.REQUIRED
}

function parseIsoDate(value: string): Date | null {
  const parts = value.split('-')

  if (parts.length !== 3) {
    return null
  }

  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  if (!year || !month || !day) {
    return null
  }

  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

/**
 * Validates a required ISO birth date that is not in the future.
 *
 * @param value - Birth date in `YYYY-MM-DD` format.
 * @returns `true` when valid, otherwise an error code.
 */
export function birthDateRule(value?: string | null): ParticipantFormRuleResult {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ParticipantFormErrorCode.REQUIRED
  }

  const date = parseIsoDate(trimmed)

  if (!date) {
    return ParticipantFormErrorCode.INVALID_BIRTH_DATE
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date > today) {
    return ParticipantFormErrorCode.BIRTH_DATE_IN_FUTURE
  }

  return true
}

/**
 * Validates a required ISO 3166-1 alpha-2 nationality code.
 *
 * @param value - Two-letter country code.
 * @returns `true` when valid, otherwise an error code.
 */
export function nationalityRule(value?: string | null): ParticipantFormRuleResult {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ParticipantFormErrorCode.REQUIRED
  }

  if (trimmed.length !== 2) {
    return ParticipantFormErrorCode.INVALID_NATIONALITY
  }

  const isLetter = (character: string) => {
    const code = character.charCodeAt(0)

    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  }

  if (!isLetter(trimmed[0]!) || !isLetter(trimmed[1]!)) {
    return ParticipantFormErrorCode.INVALID_NATIONALITY
  }

  return true
}

/**
 * Validates an optional contact phone number.
 *
 * @param value - Phone number entered by the user.
 * @returns `true` when empty or valid, otherwise an error code.
 */
export function optionalPhoneRule(value?: string | null): ParticipantFormRuleResult {
  const trimmed = value?.trim()

  if (!trimmed) {
    return true
  }

  const hasDigit = [...trimmed].some((character) => character >= '0' && character <= '9')

  if (!hasDigit || trimmed.length < 6 || trimmed.length > COMPETITOR_CONTACT_PHONE_MAX_LENGTH) {
    return ParticipantFormErrorCode.INVALID_PHONE
  }

  return true
}

/**
 * Validates a required Judo pass / JudoPass license number.
 *
 * The DJB does not publish a fixed format; this checks practical length and
 * character limits aligned with the SQLite CHECK on `competitors.pass_number`.
 *
 * @param value - Pass number entered by the user.
 * @returns `true` when valid, otherwise an error code.
 */
export function passNumberRule(value?: string | null): ParticipantFormRuleResult {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ParticipantFormErrorCode.REQUIRED
  }

  if (trimmed.length > COMPETITOR_PASS_NUMBER_MAX_LENGTH) {
    return ParticipantFormErrorCode.TEXT_TOO_LONG
  }

  if (!COMPETITOR_LICENSE_IDENTIFIER_PATTERN.test(trimmed)) {
    return ParticipantFormErrorCode.INVALID_PASS_NUMBER
  }

  return true
}

/**
 * Validates an optional competition license number.
 *
 * @param value - License number entered by the user.
 * @returns `true` when empty or valid, otherwise an error code.
 */
export function optionalLicenseNumberRule(value?: string | null): ParticipantFormRuleResult {
  const trimmed = value?.trim()

  if (!trimmed) {
    return true
  }

  if (trimmed.length > COMPETITOR_LICENSE_NUMBER_MAX_LENGTH) {
    return ParticipantFormErrorCode.TEXT_TOO_LONG
  }

  if (!COMPETITOR_LICENSE_IDENTIFIER_PATTERN.test(trimmed)) {
    return ParticipantFormErrorCode.INVALID_PASS_NUMBER
  }

  return true
}

export {
  COMPETITOR_COACH_MAX_LENGTH,
  COMPETITOR_CONTACT_PHONE_MAX_LENGTH,
  COMPETITOR_LICENSE_NUMBER_MAX_LENGTH,
  COMPETITOR_NAME_MAX_LENGTH,
  COMPETITOR_PASS_NUMBER_MAX_LENGTH
}

/**
 * Creates a rule that limits optional text to a maximum length.
 *
 * @param maxLength - Maximum allowed number of characters.
 * @returns Validation function for optional text fields.
 */
export function optionalMaxLengthRule(maxLength: number) {
  return (value?: string | null): ParticipantFormRuleResult => {
    const trimmed = value?.trim()

    if (!trimmed) {
      return true
    }

    return trimmed.length <= maxLength ? true : ParticipantFormErrorCode.TEXT_TOO_LONG
  }
}

/**
 * Creates a weight-class rule that depends on the selected age class.
 *
 * @param getAgeClassId - Returns the currently selected age class id.
 * @param getWeightClassSeeds - Returns available weight classes for validation.
 * @returns Validation function for the weight class select field.
 */
export function createWeightClassRule(
  getAgeClassId: () => string,
  getWeightClassSeeds: () => WeightClassSeed[]
) {
  return (value?: string | null): ParticipantFormRuleResult => {
    const ageClassId = getAgeClassId()

    if (!ageClassId) {
      return ParticipantFormErrorCode.REQUIRED
    }

    const allowedIds = new Set(
      getWeightClassSeeds()
        .filter((weightClass) => weightClass.ageClassId === ageClassId)
        .map((weightClass) => weightClass.id)
    )

    if (allowedIds.size === 0) {
      return true
    }

    const selected = value?.trim()

    if (!selected) {
      return ParticipantFormErrorCode.REQUIRED
    }

    return allowedIds.has(selected) ? true : ParticipantFormErrorCode.WEIGHT_CLASS_AGE_MISMATCH
  }
}
