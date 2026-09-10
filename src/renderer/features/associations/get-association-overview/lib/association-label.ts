/**
 * Builds the primary display label for a club card.
 *
 * @param club - Club name fields.
 * @param club.name - Full club name.
 * @param club.shortName - Optional short name shown in parentheses when present.
 * @returns Display label for aria and titles.
 */
export function clubLabel(club: { name: string; shortName: string | null }): string {
  const name = club.name.trim()

  if (!club.shortName?.trim()) {
    return name
  }

  return `${name} (${club.shortName.trim()})`
}
