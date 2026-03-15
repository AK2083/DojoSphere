import {
  EmailError,
  type EmailErrorCode,
  PasswordError,
  type PasswordErrorCode
} from '../../types/auth-error-codes'

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
export const emailRules: ((v?: string) => true | EmailErrorCode)[] = [
  (v?: string) => !!v || EmailError.REQUIRED,
  (v?: string) => /.+@.+\..+/.test(v ?? '') || EmailError.INVALID
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
export const passwordRules: ((v?: string) => true | PasswordErrorCode)[] = [
  (v?: string) => (v ? v.length >= PASSWORD_MIN_LENGTH : false) || PasswordError.MIN_LENGTH,
  (v?: string) => /[A-Za-z]/.test(v ?? '') || PasswordError.MISSING_LETTER
]
