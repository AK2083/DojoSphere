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
 * Club-specific configuration can replace this lookup later.
 *
 * @param club - Club name used as the color lookup key.
 * @returns Vuetify color token for the avatar background.
 */
export function participantAvatarColor(club: string): string {
  let hash = 0

  for (let index = 0; index < club.length; index += 1) {
    hash = club.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colorIndex = Math.abs(hash) % CLUB_AVATAR_COLORS.length

  return CLUB_AVATAR_COLORS[colorIndex]
}
