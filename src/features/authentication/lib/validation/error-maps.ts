import { translationKeys } from '../../i18n/keys'

/**
 * Maps email validation error codes to their corresponding translation keys.
 *
 * These keys are used together with a translation function (e.g. `t`)
 * to convert validation error codes returned by `emailRules`
 * into localized error messages.
 *
 * Error codes:
 * - `required` → Email field must not be empty.
 * - `invalidEmail` → Email format is invalid.
 */
export const emailErrorMap = {
  required: translationKeys.form.mail.required,
  invalidEmail: translationKeys.form.mail.invalid
} as const

/**
 * Maps password validation error codes to their corresponding translation keys.
 *
 * These keys are used to translate validation error codes returned by
 * `passwordRules` into user-friendly messages.
 *
 * Error codes:
 * - `minLength` → Password does not meet the minimum length requirement.
 * - `missingLetter` → Password must contain at least one letter.
 */
export const passwordErrorMap = {
  minLength: translationKeys.form.password.lessCharacters,
  missingLetter: translationKeys.form.password.noLetter
} as const
