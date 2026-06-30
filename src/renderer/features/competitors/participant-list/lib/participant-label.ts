/**
 * Builds the display label for a participant from given and family names.
 *
 * @param participant - Participant name fields.
 * @param participant.givenName - Given name.
 * @param participant.familyName - Family name.
 * @returns Full name for display and aria labels.
 */
export function participantLabel(participant: { givenName: string; familyName: string }): string {
  return `${participant.givenName} ${participant.familyName}`
}
