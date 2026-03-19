import { getStorageItem, setStorageItem } from '@shared/lib'
import type { ThemePreference } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

/**
 * Storage key used to persist the user's preferred theme mode.
 */
const THEMEKEY = 'dojosphere.settings.theme'

/**
 * Stores the user's preferred theme in browser storage.
 *
 * A monitoring event (`SETTINGS_THEME_WRITE`) is recorded before
 * the value is written. The theme preference is then persisted
 * using the configured storage utility.
 *
 * @param {ThemePreference} theme - The theme preference to store.
 */
export function setThemeToStorage(theme: ThemePreference) {
  monitorInformation(MONITORING_EVENTS.SETTINGS_THEME_WRITE, { theme })
  setStorageItem(THEMEKEY, theme)
}

/**
 * Retrieves the user's preferred theme from browser storage.
 *
 * A monitoring event (`SETTINGS_THEME_READ`) is recorded when the
 * stored value is accessed. If no theme has been stored yet,
 * the storage utility may return `undefined`.
 *
 * @returns {ThemePreference | undefined} The stored theme preference if available.
 */
export function getThemeFromStorage() {
  monitorInformation(MONITORING_EVENTS.SETTINGS_THEME_READ, { THEMEKEY })
  return getStorageItem<ThemePreference>(THEMEKEY)
}
