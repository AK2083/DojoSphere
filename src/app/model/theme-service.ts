import { getThemeFromStorage, setThemeToStorage } from '@features/settings/model/theme-storage'
import { Theme, type ThemePreference } from '@shared/types/theme-modes'

function getSystemTheme(): ThemePreference {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setThemeToStorage(prefersDark ? Theme.DARK : Theme.LIGHT)
  return prefersDark ? Theme.DARK : Theme.LIGHT
}

export function getInitialTheme(): ThemePreference {
  const stored = getThemeFromStorage()

  if (stored === Theme.LIGHT || stored === Theme.DARK) {
    return stored
  }

  return getSystemTheme()
}
