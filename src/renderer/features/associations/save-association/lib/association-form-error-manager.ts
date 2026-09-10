import translationKeys from '../i18n/keys'
import {
  ClubFormErrorCode,
  type ClubFormErrorCode as ClubFormErrorCodeType
} from './club-form-rules'

/**
 * Translates a club form validation error code.
 *
 * @param code - Validation error code.
 * @param t - Translation function.
 * @returns Localized validation message.
 */
export function translateClubFormError(
  code: ClubFormErrorCodeType,
  t: (key: string) => string
): string {
  switch (code) {
    case ClubFormErrorCode.REQUIRED:
      return t(translationKeys.validation.required)
    case ClubFormErrorCode.TEXT_TOO_LONG:
      return t(translationKeys.validation.textTooLong)
    case ClubFormErrorCode.INVALID_EMAIL:
      return t(translationKeys.validation.email.invalid)
    case ClubFormErrorCode.INVALID_WEBSITE:
      return t(translationKeys.validation.website.invalid)
    case ClubFormErrorCode.INVALID_POSTAL_CODE:
      return t(translationKeys.validation.postalCode.invalid)
    case ClubFormErrorCode.INVALID_HOUSE_NUMBER:
      return t(translationKeys.validation.houseNumber.invalid)
    case ClubFormErrorCode.INVALID_CLUB_NUMBER:
      return t(translationKeys.validation.clubNumber.invalid)
    case ClubFormErrorCode.INVALID_PHONE:
      return t(translationKeys.validation.phone.invalid)
    case ClubFormErrorCode.INVALID_CITY:
      return t(translationKeys.validation.city.invalid)
    default:
      return t(translationKeys.validation.required)
  }
}

/**
 * Adapts a club form rule to Vuetify's rule signature.
 *
 * @param rule - Domain validation rule.
 * @param t - Translation function.
 * @returns Vuetify-compatible validation rule.
 */
export function mapClubFormRule(
  rule: (value?: string | null) => true | ClubFormErrorCodeType,
  t: (key: string) => string
): (value: unknown) => boolean | string {
  return (value: unknown) => {
    const normalized = typeof value === 'string' ? value : value == null ? '' : String(value)
    const result = rule(normalized)

    if (result === true) {
      return true
    }

    return translateClubFormError(result, t)
  }
}
