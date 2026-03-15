/**
 * Available theme modes supported by the application.
 *
 * - `SYSTEM` → Uses the operating system's preferred color scheme.
 * - `LIGHT` → Forces the application to use the light theme.
 * - `DARK` → Forces the application to use the dark theme.
 */
export const Theme = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark'
} as const

/**
 * Type representing the user's theme preference.
 *
 * This type is derived from {@link Theme} and ensures that only
 * supported theme values can be used throughout the application.
 */
export type ThemePreference = (typeof Theme)[keyof typeof Theme]
