/**
 * Normalizes a header or synonym string for comparison.
 *
 * Lowercases, trims, removes diacritics, and collapses non-alphanumeric
 * characters so `"Geburts-Datum "` and `"geburtsdatum"` compare equal.
 *
 * @param value - Raw header or synonym text.
 * @returns Normalized comparison key (may be empty).
 */
export function normalizeHeader(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

/**
 * Normalizes a cell value for value-based comparison (keeps inner spaces).
 *
 * @param value - Raw cell text.
 * @returns Lowercased, diacritic-free, trimmed value.
 */
export function normalizeValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
