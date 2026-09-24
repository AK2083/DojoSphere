/** Maximum visible characters for the association card title before ellipsis. */
export const ASSOCIATION_TITLE_MAX_LENGTH = 25

/**
 * Truncates an association card title to a fixed character limit.
 *
 * @param name - Full association name.
 * @param maxLength - Maximum characters shown before appending ellipsis.
 * @returns The original name when within the limit, otherwise the truncated name with `...`.
 */
export function truncateAssociationTitle(
  name: string,
  maxLength: number = ASSOCIATION_TITLE_MAX_LENGTH
): string {
  if (name.length <= maxLength) {
    return name
  }

  return `${name.slice(0, maxLength)}...`
}
