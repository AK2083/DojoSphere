import { getStorageItem, type LanguageCode, setStorageItem } from '@shared/lib'

/**
 * Storage key used to persist the user's preferred language.
 */
const LANGUAGEKEY = 'dojosphere.settings.language'

/**
 * Stores the user's preferred language in browser storage.
 *
 * @param {LanguageCode} language - The language code to store.
 */
export function setLanguageToStorage(language: LanguageCode) {
  setStorageItem(LANGUAGEKEY, language)
}

/**
 * Retrieves the user's preferred language from browser storage.
 *
 * @returns {LanguageCode | undefined} The stored language code if available.
 */
export function getLanguageFromStorage() {
  return getStorageItem<LanguageCode>(LANGUAGEKEY)
}
