/** Placeholder palette until association-specific avatar colors are configured. */
const ASSOCIATION_AVATAR_COLORS = [
  'teal',
  'indigo',
  'deep-orange',
  'cyan',
  'purple',
  'green-darken-1',
  'blue-darken-1',
  'amber-darken-2'
] as const

/**
 * Builds uppercase initials from a association name.
 *
 * Uses the first two word initials when available, otherwise the first two letters.
 *
 * @param name - Association display name.
 * @returns Two-letter initials, or `?` when the name is empty.
 */
export function associationInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)

  if (words.length === 0) {
    return '?'
  }

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase()
  }

  return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase()
}

/**
 * Resolves a Vuetify color token from the association name.
 *
 * @param name - Association name used as the color lookup key.
 * @returns Vuetify color token for association-based surfaces.
 */
export function associationAvatarColor(name: string): string {
  let hash = 0

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colorIndex = Math.abs(hash) % ASSOCIATION_AVATAR_COLORS.length

  return ASSOCIATION_AVATAR_COLORS[colorIndex]
}

const ASSOCIATION_HEADER_TINT_PERCENT = 8

/**
 * Returns a subtle association-tinted background for card headers.
 *
 * @param name - Association name used as the color lookup key.
 * @returns CSS `background-color` value with a low association-color mix ratio.
 */
export function associationHeaderBackground(name: string): string {
  const colorToken = associationAvatarColor(name)

  return `color-mix(in srgb, rgb(var(--v-theme-${colorToken})) ${ASSOCIATION_HEADER_TINT_PERCENT}%, rgb(var(--v-theme-surface)))`
}
