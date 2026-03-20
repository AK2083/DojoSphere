import {
  getLanguageFromStorage,
  setLanguageToStorage
} from '@features/settings/model/set_language/language-storage'
import { AvailableLanguages, FallbackLanguage, LanguageCode } from '@shared/lib/i18n/languages'

/**
 * Detects the user's preferred language based on the browser settings.
 *
 * The function checks the languages provided by the browser (`navigator.languages`
 * or `navigator.language`) and tries to match them against the application's
 * supported languages (`AvailableLanguages`).
 *
 * Only the base language code is considered (e.g. "en" from "en-US").
 *
 * If none of the browser languages match the available languages,
 * the configured `FallbackLanguage` is returned.
 *
 * @returns {LanguageCode} The detected system language if supported,
 * otherwise the fallback language.
 */
function getSystemLanguage(): LanguageCode {
  const browserLanguages = navigator.languages ?? [navigator.language]

  for (const lang of browserLanguages) {
    const code = lang.split('-')[0]

    const match = AvailableLanguages.find((l) => l.code === code)

    if (match) return match.code
  }

  return FallbackLanguage
}

/**
 * Determines the initial language used by the application.
 *
 * The function first checks whether a language preference is stored
 * in the browser (via `getLanguageFromStorage`). If a valid stored
 * language exists and is supported by the application, it will be used.
 *
 * If no valid stored language exists, the system language is detected
 * using {@link getSystemLanguage}. The detected language will then be
 * stored via `setLanguageToStorage` for future sessions.
 *
 * @returns {LanguageCode} The language that should be used when the
 * application initializes.
 */
export function getInitialLanguage(): LanguageCode {
  const stored = getLanguageFromStorage()

  if (stored && AvailableLanguages.some((lang) => lang.code === stored)) {
    return stored
  }

  const systemLang = getSystemLanguage()
  setLanguageToStorage(systemLang)

  return systemLang
}
