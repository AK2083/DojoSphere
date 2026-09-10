/** Canonical validation error codes for the club form. */
export const ClubFormErrorCode = {
  REQUIRED: 'required',
  TEXT_TOO_LONG: 'textTooLong',
  INVALID_EMAIL: 'invalidEmail',
  INVALID_WEBSITE: 'invalidWebsite',
  INVALID_POSTAL_CODE: 'invalidPostalCode',
  INVALID_HOUSE_NUMBER: 'invalidHouseNumber',
  INVALID_CLUB_NUMBER: 'invalidClubNumber',
  INVALID_PHONE: 'invalidPhone',
  INVALID_CITY: 'invalidCity'
} as const

/** Validation error codes returned by club form rules. */
export type ClubFormErrorCode = (typeof ClubFormErrorCode)[keyof typeof ClubFormErrorCode]

/** Result of a club form validation rule. */
export type ClubFormRuleResult = true | ClubFormErrorCode

/** Soft length limits aligned with practical SQLite TEXT columns / German formats. */
export const CLUB_NAME_MAX_LENGTH = 120
export /**
 *
 */
const CLUB_SHORT_NAME_MAX_LENGTH = 40
export /**
 *
 */
const CLUB_CITY_MAX_LENGTH = 80
export /**
 *
 */
const CLUB_STREET_MAX_LENGTH = 120
export /**
 *
 */
const CLUB_HOUSE_NUMBER_MAX_LENGTH = 10
export /**
 *
 */
const CLUB_POSTAL_CODE_LENGTH = 5
export /**
 *
 */
const CLUB_WEBSITE_HOST_MAX_LENGTH = 180
export /**
 *
 */
const CLUB_DISTRICT_MAX_LENGTH = 120
export /**
 *
 */
const CLUB_NUMBER_MAX_LENGTH = 12
export /**
 *
 */
const CLUB_EMAIL_MAX_LENGTH = 120
export /**
 *
 */
const CLUB_PHONE_MAX_LENGTH = 20
export /**
 *
 */
const CLUB_PHONE_MIN_DIGITS = 3

/**
 * Requires a non-empty trimmed text value.
 *
 * @param value - Field value to validate.
 * @returns `true` when valid, otherwise an error code.
 */
export function requiredFieldRule(value?: string | null): ClubFormRuleResult {
  return value?.trim() ? true : ClubFormErrorCode.REQUIRED
}

/**
 * Validates optional text against a maximum length.
 *
 * @param maxLength - Maximum allowed characters.
 * @returns Rule function for the given max length.
 */
export function optionalMaxLengthRule(
  maxLength: number
): (value?: string | null) => ClubFormRuleResult {
  return (value?: string | null) => {
    if (!value?.trim()) {
      return true
    }

    return value.trim().length <= maxLength ? true : ClubFormErrorCode.TEXT_TOO_LONG
  }
}

/**
 * Validates a required text field against a maximum length.
 *
 * @param maxLength - Maximum allowed characters.
 * @returns Rule function for the given max length.
 */
export function requiredMaxLengthRule(
  maxLength: number
): (value?: string | null) => ClubFormRuleResult {
  return (value?: string | null) => {
    const required = requiredFieldRule(value)

    if (required !== true) {
      return required
    }

    return optionalMaxLengthRule(maxLength)(value)
  }
}

/**
 * Validates an optional email address.
 *
 * @param value - Email value.
 * @returns `true` when empty or a plausible email, otherwise an error code.
 */
export function optionalEmailRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_EMAIL_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? true : ClubFormErrorCode.INVALID_EMAIL
}

/**
 * Validates an optional website host/path (protocol selected separately).
 *
 * @param value - Host and optional path without protocol.
 * @returns `true` when empty or a plausible host path, otherwise an error code.
 */
export function optionalWebsiteHostRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim().replace(/^\/+/, '') ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_WEBSITE_HOST_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  if (/\s/.test(trimmed) || trimmed.includes('://')) {
    return ClubFormErrorCode.INVALID_WEBSITE
  }

  try {
    const url = new URL(`https://${trimmed}`)

    return url.hostname.includes('.') ? true : ClubFormErrorCode.INVALID_WEBSITE
  } catch {
    return ClubFormErrorCode.INVALID_WEBSITE
  }
}

/**
 * Validates an optional German postal code (exactly 5 digits).
 *
 * @param value - Postal code value.
 * @returns `true` when empty or exactly five digits, otherwise an error code.
 */
export function optionalGermanPostalCodeRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  return /^\d{5}$/.test(trimmed) ? true : ClubFormErrorCode.INVALID_POSTAL_CODE
}

/**
 * Validates an optional house number (digits, letters, and common separators).
 *
 * @param value - House number value.
 * @returns `true` when empty or a plausible house number, otherwise an error code.
 */
export function optionalHouseNumberRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_HOUSE_NUMBER_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  return /^[0-9A-Za-zÄÖÜäöüß][0-9A-Za-zÄÖÜäöüß\-\/\s]*$/.test(trimmed)
    ? true
    : ClubFormErrorCode.INVALID_HOUSE_NUMBER
}

/**
 * Validates an optional club number (digits only).
 *
 * @param value - Club number value.
 * @returns `true` when empty or digits within length, otherwise an error code.
 */
export function optionalClubNumberRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_NUMBER_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  return /^\d+$/.test(trimmed) ? true : ClubFormErrorCode.INVALID_CLUB_NUMBER
}

/**
 * Validates an optional national phone number (without country calling code).
 *
 * @param value - National phone number.
 * @returns `true` when empty or a plausible phone number, otherwise an error code.
 */
export function optionalPhoneNumberRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_PHONE_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  if (!/^[0-9\s\-/]+$/.test(trimmed)) {
    return ClubFormErrorCode.INVALID_PHONE
  }

  const digitCount = [...trimmed].filter((character) => character >= '0' && character <= '9').length

  return digitCount >= CLUB_PHONE_MIN_DIGITS ? true : ClubFormErrorCode.INVALID_PHONE
}

/**
 * Validates an optional city name (letters, spaces, and common punctuation).
 *
 * @param value - City value.
 * @returns `true` when empty or a plausible city name, otherwise an error code.
 */
export function optionalCityRule(value?: string | null): ClubFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > CLUB_CITY_MAX_LENGTH) {
    return ClubFormErrorCode.TEXT_TOO_LONG
  }

  return /^[\p{L}][\p{L}\d\s.'\-]*$/u.test(trimmed) ? true : ClubFormErrorCode.INVALID_CITY
}
