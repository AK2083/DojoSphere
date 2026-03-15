/**
 * Minimum required length for user passwords.
 *
 * Used by password validation rules to ensure a basic level of security.
 */
export const PASSWORD_MIN_LENGTH = 12

/**
 * Validation rules for email input fields.
 *
 * Each rule returns `true` if validation succeeds or an error code string
 * if validation fails. These error codes can be mapped to localized
 * messages (e.g. via a translation function).
 *
 * Rules:
 * - `required` → The field must not be empty.
 * - `invalidEmail` → The value must match a basic email format.
 *
 * @type {((v?: string) => true | 'required' | 'invalidEmail')[]}
 */
export const emailRules: ((v?: string) => true | 'required' | 'invalidEmail')[] = [
  (v?: string) => !!v || 'required',
  (v?: string) => /.+@.+\..+/.test(v ?? '') || 'invalidEmail'
]

/**
 * Validation rules for password input fields.
 *
 * Each rule returns `true` if validation succeeds or an error code string
 * if validation fails. These codes can later be mapped to translated
 * error messages.
 *
 * Rules:
 * - `minLength` → Password must be at least {@link PASSWORD_MIN_LENGTH} characters long.
 * - `missingLetter` → Password must contain at least one letter.
 *
 * @type {((v?: string) => true | 'minLength' | 'missingLetter')[]}
 */
export const passwordRules: ((v?: string) => true | 'minLength' | 'missingLetter')[] = [
  (v?: string) => (v ? v.length >= PASSWORD_MIN_LENGTH : false) || 'minLength',
  (v?: string) => /[A-Za-z]/.test(v ?? '') || 'missingLetter'
]
