/** Canonical validation error codes for the association form. */
export const AssociationFormErrorCode = {
  REQUIRED: 'required',
  TEXT_TOO_LONG: 'textTooLong',
  INVALID_EMAIL: 'invalidEmail',
  INVALID_WEBSITE: 'invalidWebsite',
  INVALID_POSTAL_CODE: 'invalidPostalCode',
  INVALID_HOUSE_NUMBER: 'invalidHouseNumber',
  INVALID_ASSOCIATION_NUMBER: 'invalidAssociationNumber',
  INVALID_PHONE: 'invalidPhone',
  INVALID_CITY: 'invalidCity'
} as const

/** Validation error codes returned by association form rules. */
export type AssociationFormErrorCode =
  (typeof AssociationFormErrorCode)[keyof typeof AssociationFormErrorCode]

/** Result of a association form validation rule. */
export type AssociationFormRuleResult = true | AssociationFormErrorCode

/** Soft length limits aligned with practical SQLite TEXT columns / German formats. */
export const ASSOCIATION_NAME_MAX_LENGTH = 120
export /**
 *
 */
const ASSOCIATION_SHORT_NAME_MAX_LENGTH = 40
export /**
 *
 */
const ASSOCIATION_CITY_MAX_LENGTH = 80
export /**
 *
 */
const ASSOCIATION_STREET_MAX_LENGTH = 120
export /**
 *
 */
const ASSOCIATION_HOUSE_NUMBER_MAX_LENGTH = 10
export /**
 *
 */
const ASSOCIATION_POSTAL_CODE_LENGTH = 5
export /**
 *
 */
const ASSOCIATION_WEBSITE_HOST_MAX_LENGTH = 180
export /**
 *
 */
const ASSOCIATION_DISTRICT_MAX_LENGTH = 120
export /**
 *
 */
const ASSOCIATION_NUMBER_MAX_LENGTH = 12
export /**
 *
 */
const ASSOCIATION_EMAIL_MAX_LENGTH = 120
export /**
 *
 */
const ASSOCIATION_PHONE_MAX_LENGTH = 20
export /**
 *
 */
const ASSOCIATION_PHONE_MIN_DIGITS = 3

/**
 * Requires a non-empty trimmed text value.
 *
 * @param value - Field value to validate.
 * @returns `true` when valid, otherwise an error code.
 */
export function requiredFieldRule(value?: string | null): AssociationFormRuleResult {
  return value?.trim() ? true : AssociationFormErrorCode.REQUIRED
}

/**
 * Validates optional text against a maximum length.
 *
 * @param maxLength - Maximum allowed characters.
 * @returns Rule function for the given max length.
 */
export function optionalMaxLengthRule(
  maxLength: number
): (value?: string | null) => AssociationFormRuleResult {
  return (value?: string | null) => {
    if (!value?.trim()) {
      return true
    }

    return value.trim().length <= maxLength ? true : AssociationFormErrorCode.TEXT_TOO_LONG
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
): (value?: string | null) => AssociationFormRuleResult {
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
export function optionalEmailRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_EMAIL_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? true : AssociationFormErrorCode.INVALID_EMAIL
}

/**
 * Validates an optional website host/path (protocol selected separately).
 *
 * @param value - Host and optional path without protocol.
 * @returns `true` when empty or a plausible host path, otherwise an error code.
 */
export function optionalWebsiteHostRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim().replace(/^\/+/, '') ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_WEBSITE_HOST_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  if (/\s/.test(trimmed) || trimmed.includes('://')) {
    return AssociationFormErrorCode.INVALID_WEBSITE
  }

  try {
    const url = new URL(`https://${trimmed}`)

    return url.hostname.includes('.') ? true : AssociationFormErrorCode.INVALID_WEBSITE
  } catch {
    return AssociationFormErrorCode.INVALID_WEBSITE
  }
}

/**
 * Validates an optional German postal code (exactly 5 digits).
 *
 * @param value - Postal code value.
 * @returns `true` when empty or exactly five digits, otherwise an error code.
 */
export function optionalGermanPostalCodeRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  return /^\d{5}$/.test(trimmed) ? true : AssociationFormErrorCode.INVALID_POSTAL_CODE
}

/**
 * Validates an optional house number (digits, letters, and common separators).
 *
 * @param value - House number value.
 * @returns `true` when empty or a plausible house number, otherwise an error code.
 */
export function optionalHouseNumberRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_HOUSE_NUMBER_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  return /^[0-9A-Za-zÄÖÜäöüß][0-9A-Za-zÄÖÜäöüß\-\/\s]*$/.test(trimmed)
    ? true
    : AssociationFormErrorCode.INVALID_HOUSE_NUMBER
}

/**
 * Validates an optional association number (digits only).
 *
 * @param value - Association number value.
 * @returns `true` when empty or digits within length, otherwise an error code.
 */
export function optionalAssociationNumberRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_NUMBER_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  return /^\d+$/.test(trimmed) ? true : AssociationFormErrorCode.INVALID_ASSOCIATION_NUMBER
}

/**
 * Validates an optional national phone number (without country calling code).
 *
 * @param value - National phone number.
 * @returns `true` when empty or a plausible phone number, otherwise an error code.
 */
export function optionalPhoneNumberRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_PHONE_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  if (!/^[0-9\s\-/]+$/.test(trimmed)) {
    return AssociationFormErrorCode.INVALID_PHONE
  }

  const digitCount = [...trimmed].filter((character) => character >= '0' && character <= '9').length

  return digitCount >= ASSOCIATION_PHONE_MIN_DIGITS ? true : AssociationFormErrorCode.INVALID_PHONE
}

/**
 * Validates an optional city name (letters, spaces, and common punctuation).
 *
 * @param value - City value.
 * @returns `true` when empty or a plausible city name, otherwise an error code.
 */
export function optionalCityRule(value?: string | null): AssociationFormRuleResult {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return true
  }

  if (trimmed.length > ASSOCIATION_CITY_MAX_LENGTH) {
    return AssociationFormErrorCode.TEXT_TOO_LONG
  }

  return /^[\p{L}][\p{L}\d\s.'\-]*$/u.test(trimmed) ? true : AssociationFormErrorCode.INVALID_CITY
}
