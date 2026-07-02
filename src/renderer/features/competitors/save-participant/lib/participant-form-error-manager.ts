import translationKeys from '../i18n/keys'
import type { ParticipantFormErrorCode } from './participant-form-rules'

const errorTranslationMap: Record<ParticipantFormErrorCode, string> = {
  required: translationKeys.validation.required,
  invalidGender: translationKeys.validation.gender.invalid,
  invalidBirthDate: translationKeys.validation.birthDate.invalid,
  birthDateInFuture: translationKeys.validation.birthDate.inFuture,
  invalidNationality: translationKeys.validation.nationality.invalid,
  invalidPassNumber: translationKeys.validation.passNumber.invalid,
  invalidPhone: translationKeys.validation.phone.invalid,
  textTooLong: translationKeys.validation.textTooLong,
  weightClassAgeMismatch: translationKeys.validation.weightClass.ageMismatch
}

/**
 * Translates a participant form validation error code.
 *
 * @param code - Validation error code returned by a rule.
 * @param t - Application translation function.
 * @returns Localized validation message.
 */
export function translateParticipantFormError(
  code: ParticipantFormErrorCode,
  t: (key: string) => string
): string {
  return t(errorTranslationMap[code])
}

/**
 * Wraps a participant form rule for Vuetify validation.
 *
 * @param rule - Validation rule returning `true` or an error code.
 * @param t - Application translation function.
 * @returns Vuetify-compatible validation rule.
 */
export function mapParticipantFormRule(
  rule: (value?: string | null) => true | ParticipantFormErrorCode,
  t: (key: string) => string
): (value: unknown) => boolean | string {
  return (value: unknown) => {
    const normalized = typeof value === 'string' ? value : value == null ? '' : String(value)
    const result = rule(normalized)

    if (result === true) {
      return true
    }

    return translateParticipantFormError(result, t)
  }
}
