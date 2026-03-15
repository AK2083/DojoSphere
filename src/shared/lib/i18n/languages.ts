/**
 * Supported language codes used by the application.
 *
 * This constant defines the allowed language identifiers that can be used
 * throughout the application for localization and internationalization.
 */
export const LanguageCode = {
  DE: 'de',
  EN: 'en'
} as const

/**
 * Type representing all supported language codes.
 *
 * This type is derived from {@link LanguageCode} and ensures that only
 * defined language codes can be used in the application.
 */
export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode]

/**
 * List of languages supported by the application.
 *
 * Each entry contains:
 * - `code`: The internal {@link LanguageCode} used for localization.
 * - `label`: A human-readable language name used in UI elements
 *   such as language selectors or settings menus.
 *
 * The array is defined as `ReadonlyArray` to prevent modification
 * at runtime.
 */
export const AvailableLanguages: ReadonlyArray<{
  code: LanguageCode
  label: string
}> = [
  { code: LanguageCode.DE, label: 'Deutsch' },
  { code: LanguageCode.EN, label: 'English' }
]

/**
 * Default language used when no valid language preference
 * can be determined from user settings or browser preferences.
 */
export const FallbackLanguage: LanguageCode = LanguageCode.EN
