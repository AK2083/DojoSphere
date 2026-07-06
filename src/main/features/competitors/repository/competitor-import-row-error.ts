import { DUPLICATE_COMPETITOR_ERROR } from './competitor-duplicate'

/**
 * Maps an import row failure to a stable row error code.
 *
 * @param error - Thrown value from {@link addCompetitor}.
 * @returns Row error code for the import result UI.
 */
export function importRowFailureCode(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  return message === DUPLICATE_COMPETITOR_ERROR ? DUPLICATE_COMPETITOR_ERROR : 'import_failed'
}
