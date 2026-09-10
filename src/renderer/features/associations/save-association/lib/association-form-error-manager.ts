import translationKeys from '../i18n/keys'
import {
  AssociationFormErrorCode,
  type AssociationFormErrorCode as AssociationFormErrorCodeType
} from './association-form-rules'

/**
 * Translates a association form validation error code.
 *
 * @param code - Validation error code.
 * @param t - Translation function.
 * @returns Localized validation message.
 */
export function translateAssociationFormError(
  code: AssociationFormErrorCodeType,
  t: (key: string) => string
): string {
  switch (code) {
    case AssociationFormErrorCode.REQUIRED:
      return t(translationKeys.validation.required)
    case AssociationFormErrorCode.TEXT_TOO_LONG:
      return t(translationKeys.validation.textTooLong)
    case AssociationFormErrorCode.INVALID_EMAIL:
      return t(translationKeys.validation.email.invalid)
    case AssociationFormErrorCode.INVALID_WEBSITE:
      return t(translationKeys.validation.website.invalid)
    case AssociationFormErrorCode.INVALID_POSTAL_CODE:
      return t(translationKeys.validation.postalCode.invalid)
    case AssociationFormErrorCode.INVALID_HOUSE_NUMBER:
      return t(translationKeys.validation.houseNumber.invalid)
    case AssociationFormErrorCode.INVALID_ASSOCIATION_NUMBER:
      return t(translationKeys.validation.associationNumber.invalid)
    case AssociationFormErrorCode.INVALID_PHONE:
      return t(translationKeys.validation.phone.invalid)
    case AssociationFormErrorCode.INVALID_CITY:
      return t(translationKeys.validation.city.invalid)
    default:
      return t(translationKeys.validation.required)
  }
}

/**
 * Adapts a association form rule to Vuetify's rule signature.
 *
 * @param rule - Domain validation rule.
 * @param t - Translation function.
 * @returns Vuetify-compatible validation rule.
 */
export function mapAssociationFormRule(
  rule: (value?: string | null) => true | AssociationFormErrorCodeType,
  t: (key: string) => string
): (value: unknown) => boolean | string {
  return (value: unknown) => {
    const normalized = typeof value === 'string' ? value : value == null ? '' : String(value)
    const result = rule(normalized)

    if (result === true) {
      return true
    }

    return translateAssociationFormError(result, t)
  }
}
