/**
 * Motion/duration design tokens in milliseconds.
 * Framework-neutral — map to Vuetify defaults, Tailwind theme, or CSS variables later.
 */
export const durationTokens = {
  tooltip: 600
} as const

/**
 * Type for the duration tokens.
 */
export type DurationTokens = typeof durationTokens
