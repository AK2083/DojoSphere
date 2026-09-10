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
 * Resolves a Vuetify color token from the participant's association name.
 *
 * Used for avatar accents and subtle association header tints.
 *
 * @param association - Association name used as the color lookup key.
 * @returns Vuetify color token for association-based surfaces.
 */
export function participantAvatarColor(association: string): string {
  let hash = 0

  for (let index = 0; index < association.length; index += 1) {
    hash = association.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colorIndex = Math.abs(hash) % ASSOCIATION_AVATAR_COLORS.length

  return ASSOCIATION_AVATAR_COLORS[colorIndex]
}

const ASSOCIATION_HEADER_TINT_PERCENT = 8

/**
 * Returns a subtle association-tinted background for card headers.
 *
 * Keeps body text on the default surface color for accessible contrast.
 *
 * @param association - Association name used as the color lookup key.
 * @returns CSS `background-color` value with a low association-color mix ratio.
 */
export function participantAssociationHeaderBackground(association: string): string {
  const colorToken = participantAvatarColor(association)

  return `color-mix(in srgb, rgb(var(--v-theme-${colorToken})) ${ASSOCIATION_HEADER_TINT_PERCENT}%, rgb(var(--v-theme-surface)))`
}
