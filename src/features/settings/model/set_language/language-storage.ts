import { getStorageItem, type LanguageCode, setStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

/**
 * Storage key used to persist the user's preferred language.
 */
const LANGUAGEKEY = 'dojosphere.settings.language'

/**
 * Stores the user's preferred language in browser storage.
 *
 * A monitoring event (`SETTINGS_LANG_WRITE`) is recorded before
 * persisting the value. The language is then saved using the
 * configured storage utility.
 *
 * @param {LanguageCode} language - The language code to store.
 */
export function setLanguageToStorage(language: LanguageCode) {
  monitorInformation(MONITORING_EVENTS.SETTINGS_LANG_WRITE, { language })
  setStorageItem(LANGUAGEKEY, language)
}

/**
 * Retrieves the user's preferred language from browser storage.
 *
 * A monitoring event (`SETTINGS_LANG_READ`) is recorded when the
 * value is accessed. If no language has been stored yet, the
 * underlying storage utility may return `undefined`.
 *
 * @returns {LanguageCode | undefined} The stored language code if available.
 */
export function getLanguageFromStorage() {
  monitorInformation(MONITORING_EVENTS.SETTINGS_LANG_READ, { LANGUAGEKEY })
  return getStorageItem<LanguageCode>(LANGUAGEKEY)
}
