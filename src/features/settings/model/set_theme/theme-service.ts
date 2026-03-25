import {
  getThemeFromStorage,
  setThemeToStorage
} from '@features/settings/model/set_theme/theme-storage'
import { Theme, type ThemePreference } from '@shared/types/theme-modes'

/**
 * Detects the user's preferred color scheme from the operating system.
 *
 * The function uses the `prefers-color-scheme` media query to determine
 * whether the user prefers a dark or light theme. The detected theme
 * will be stored via `setThemeToStorage` so it can be reused in future
 * sessions.
 *
 * @returns {ThemePreference} The detected system theme (`Theme.DARK` or `Theme.LIGHT`).
 */
function getSystemTheme(): ThemePreference {
  const prefersDark =
    globalThis.window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
  setThemeToStorage(prefersDark ? Theme.DARK : Theme.LIGHT)
  return prefersDark ? Theme.DARK : Theme.LIGHT
}

/**
 * Determines the initial theme used by the application.
 *
 * The function first checks whether a theme preference is stored
 * in the browser (via `getThemeFromStorage`). If a valid stored theme
 * (`Theme.LIGHT` or `Theme.DARK`) exists, it will be used.
 *
 * If no valid stored value is found, the system theme will be detected
 * using {@link getSystemTheme}.
 *
 * @returns {ThemePreference} The theme that should be applied when the
 * application initializes.
 */
export function getInitialTheme(): ThemePreference {
  const stored = getThemeFromStorage()

  if (stored === Theme.LIGHT || stored === Theme.DARK) {
    return stored
  }

  return getSystemTheme()
}
