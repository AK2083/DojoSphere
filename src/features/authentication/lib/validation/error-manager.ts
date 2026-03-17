import { translationKeys } from '@features/authentication/i18n/keys'

/**
 * Defines the canonical set of application-level error codes used across
 * validation, API handling, and UI error reporting.
 *
 * These codes represent normalized error identifiers independent of the
 * original error source (e.g. validation rules, Supabase responses, or
 * domain logic). They are later mapped to translation keys via
 * {@link errorTranslationMap} to produce localized user-facing messages.
 *
 * Using centralized error codes ensures consistent error handling and
 * prevents UI components from depending on implementation-specific
 * error messages.
 */
export const ErrorCode = {
  REQUIRED: 'required',
  INVALID_EMAIL: 'invalidEmail',

  PASSWORD_MIN_LENGTH: 'passwordMinLength',
  PASSWORD_MISSING_LETTER: 'passwordMissingLetter',

  UNKNOWN: 'unknown'
} as const

/**
 * Union type representing all supported application error codes.
 *
 * This type is derived directly from {@link ErrorCode} to guarantee
 * type safety and ensure that only defined error codes are used
 * throughout the application.
 */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Maps application error codes to their corresponding translation keys.
 *
 * The values reference keys defined in the feature's i18n configuration
 * (e.g. {@link translationKeys}). These keys are resolved using the
 * application's translation function (`t`) to produce localized
 * error messages for display in the UI.
 *
 * Each {@link ErrorCode} must have a corresponding translation key,
 * ensuring consistent and centralized error message handling.
 */
export const errorTranslationMap: Record<ErrorCode, string> = {
  required: translationKeys.form.mail.required,
  invalidEmail: translationKeys.form.mail.invalid,

  passwordMinLength: translationKeys.form.password.lessCharacters,
  passwordMissingLetter: translationKeys.form.password.noLetter,

  unknown: translationKeys.form.error.unknown
}

/**
 * Translates an application error code into a localized message.
 *
 * The function resolves the given {@link ErrorCode} using the
 * {@link errorTranslationMap} to obtain the corresponding translation key.
 * The key is then passed to the provided translation function (e.g. `t`)
 * to produce the localized error message.
 *
 * If the given error code is not found in the mapping, the fallback
 * translation for {@link ErrorCode.UNKNOWN} is used.
 *
 * @param code - The application-level error code to translate.
 * @param t - Translation function used to resolve i18n keys into localized strings.
 * @returns The localized error message for the provided error code.
 */
export function translateError(code: ErrorCode, t: (key: string) => string) {
  const key = errorTranslationMap[code] ?? errorTranslationMap.unknown
  return t(key)
}
