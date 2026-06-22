import { getStorageItem, setStorageItem } from '@shared/lib'
import type { ThemePreference } from '@shared/types'

/**
 * Storage key used to persist the user's preferred theme mode.
 */
const THEMEKEY = 'dojosphere.settings.theme'

/**
 * Stores the user's preferred theme in browser storage.
 *
 * @param {ThemePreference} theme - The theme preference to store.
 */
export function setThemeToStorage(theme: ThemePreference) {
  setStorageItem(THEMEKEY, theme)
}

/**
 * Retrieves the user's preferred theme from browser storage.
 *
 * @returns {ThemePreference | undefined} The stored theme preference if available.
 */
export function getThemeFromStorage() {
  return getStorageItem<ThemePreference>(THEMEKEY)
}
