/** Placeholder palette until club-specific avatar colors are configured. */
const CLUB_AVATAR_COLORS = [
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
 * Builds uppercase initials from a club name.
 *
 * Uses the first two word initials when available, otherwise the first two letters.
 *
 * @param name - Club display name.
 * @returns Two-letter initials, or `?` when the name is empty.
 */
export function clubInitials(name: string): string {
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
 * Resolves a Vuetify color token from the club name.
 *
 * @param name - Club name used as the color lookup key.
 * @returns Vuetify color token for club-based surfaces.
 */
export function clubAvatarColor(name: string): string {
  let hash = 0

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colorIndex = Math.abs(hash) % CLUB_AVATAR_COLORS.length

  return CLUB_AVATAR_COLORS[colorIndex]
}

const CLUB_HEADER_TINT_PERCENT = 8

/**
 * Returns a subtle club-tinted background for card headers.
 *
 * @param name - Club name used as the color lookup key.
 * @returns CSS `background-color` value with a low club-color mix ratio.
 */
export function clubHeaderBackground(name: string): string {
  const colorToken = clubAvatarColor(name)

  return `color-mix(in srgb, rgb(var(--v-theme-${colorToken})) ${CLUB_HEADER_TINT_PERCENT}%, rgb(var(--v-theme-surface)))`
}
