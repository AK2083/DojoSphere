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
 * Builds uppercase initials from a participant's given and family names.
 *
 * @param participant - Participant name fields.
 * @param participant.givenName - Given name.
 * @param participant.familyName - Family name.
 * @returns Two-letter initials, or `?` when both names are empty.
 */
export function participantInitials(participant: {
  givenName: string
  familyName: string
}): string {
  const givenInitial = participant.givenName.trim().charAt(0)
  const familyInitial = participant.familyName.trim().charAt(0)

  if (!givenInitial && !familyInitial) {
    return '?'
  }

  return `${givenInitial}${familyInitial}`.toUpperCase()
}

/**
 * Resolves a Vuetify color token from the participant's club name.
 *
 * Used for avatar accents and subtle club header tints.
 *
 * @param club - Club name used as the color lookup key.
 * @returns Vuetify color token for club-based surfaces.
 */
export function participantAvatarColor(club: string): string {
  let hash = 0

  for (let index = 0; index < club.length; index += 1) {
    hash = club.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colorIndex = Math.abs(hash) % CLUB_AVATAR_COLORS.length

  return CLUB_AVATAR_COLORS[colorIndex]
}

const CLUB_HEADER_TINT_PERCENT = 8

/**
 * Returns a subtle club-tinted background for card headers.
 *
 * Keeps body text on the default surface color for accessible contrast.
 *
 * @param club - Club name used as the color lookup key.
 * @returns CSS `background-color` value with a low club-color mix ratio.
 */
export function participantClubHeaderBackground(club: string): string {
  const colorToken = participantAvatarColor(club)

  return `color-mix(in srgb, rgb(var(--v-theme-${colorToken})) ${CLUB_HEADER_TINT_PERCENT}%, rgb(var(--v-theme-surface)))`
}
