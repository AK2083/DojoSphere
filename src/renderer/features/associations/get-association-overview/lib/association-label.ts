/**
 * Builds the primary display label for a association card.
 *
 * @param association - Association name fields.
 * @param association.name - Full association name.
 * @param association.shortName - Optional short name shown in parentheses when present.
 * @returns Display label for aria and titles.
 */
export function associationLabel(association: { name: string; shortName: string | null }): string {
  const name = association.name.trim()

  if (!association.shortName?.trim()) {
    return name
  }

  return `${name} (${association.shortName.trim()})`
}
