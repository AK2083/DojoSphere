import {
  getStorageItem,
  setStorageItem
} from '@shared/lib/browser/local-storage'
import type { ThemePreference } from '@shared/types/theme-modes'

const THEMEKEY = 'thememode'

export function setThemeToStorage(theme: ThemePreference) {
  setStorageItem(THEMEKEY, theme)
}

export function getThemeFromStorage() {
  return getStorageItem<ThemePreference>(THEMEKEY)
}
