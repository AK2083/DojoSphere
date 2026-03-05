export const Theme = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark'
} as const

export type ThemePreference = (typeof Theme)[keyof typeof Theme]
