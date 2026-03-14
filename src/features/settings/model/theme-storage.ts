import { getStorageItem, setStorageItem } from '@shared/lib/browser/local-storage'
import type { ThemePreference } from '@shared/types/theme-modes'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const THEMEKEY = 'thememode'

export function setThemeToStorage(theme: ThemePreference) {
  monitorInformation(MONITORING_EVENTS.SETTINGS_THEME_WRITE, { theme })
  setStorageItem(THEMEKEY, theme)
}

export function getThemeFromStorage() {
  monitorInformation(MONITORING_EVENTS.SETTINGS_THEME_READ, { THEMEKEY })
  return getStorageItem<ThemePreference>(THEMEKEY)
}
