import { ErrorCode, translateError } from './error-manager'

/**
 * Minimum required length for user passwords.
 *
 * Used by password validation rules to ensure a basic level of security.
 */
export const PASSWORD_MIN_LENGTH = 12

/**
 * Validation rules for email input fields.
 *
 * Each rule returns `true` if validation succeeds or an error code
 * of type {@link EmailErrorCode} if validation fails.
 * These error codes can later be mapped to localized messages.
 *
 * Rules:
 * - `required` → The field must not be empty.
 * - `invalidEmail` → The value must match a basic email format.
 *
 * @param v
 * @returns {(v?: string) => true | EmailErrorCode}[]
 * An array of validation functions used by form inputs.
 */
export const emailRules: ((v?: string) => true | ErrorCode)[] = [
  (v?: string) => !!v || ErrorCode.REQUIRED,
  (v?: string) => /.+@.+\..+/.test(v ?? '') || ErrorCode.INVALID_EMAIL
]

/**
 * Validation rules for password input fields.
 *
 * Each rule returns `true` if validation succeeds or an error code
 * of type {@link PasswordErrorCode} if validation fails.
 * These codes can later be mapped to translated error messages.
 *
 * Rules:
 * - `minLength` → Password must be at least {@link PASSWORD_MIN_LENGTH} characters long.
 * - `missingLetter` → Password must contain at least one letter.
 *
 * @param v
 * @returns {(v?: string) => true | PasswordErrorCode}[]
 * An array of validation functions used by password form inputs.
 */
export const passwordRules: ((v?: string) => true | ErrorCode)[] = [
  (v?: string) => (v ? v.length >= PASSWORD_MIN_LENGTH : false) || ErrorCode.PASSWORD_MIN_LENGTH,
  (v?: string) => /[A-Za-z]/.test(v ?? '') || ErrorCode.PASSWORD_MISSING_LETTER
]

/**
 * Wraps a validation rule and converts its returned {@link ErrorCode}
 * into a translated error message.
 *
 * The provided `rule` function returns either `true` (validation passed)
 * or an {@link ErrorCode}. If an error code is returned, it will be
 * translated using {@link translateError} and the provided translation
 * function `t`.
 *
 * This helper allows validation rules to stay framework-agnostic while
 * the UI receives localized error messages compatible with Vuetify's
 * validation system.
 *
 * @param rule
 * Validation function that returns `true` if valid or an {@link ErrorCode}
 * representing the validation failure.
 *
 * @param t
 * Translation function used to resolve i18n keys into localized strings.
 *
 * @returns
 * A wrapped validation rule that returns `true` if validation succeeds,
 * otherwise the translated error message.
 */
export function mapRule(rule: (v: string) => true | ErrorCode, t: (key: string) => string) {
  return (value: string) => {
    const result = rule(value)

    if (result === true) return true

    return translateError(result, t)
  }
}
