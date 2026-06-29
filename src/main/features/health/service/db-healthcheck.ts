import { getDatabase } from '@main/shared/database'

/**
 * Runs a SQLite health check and returns the database version.
 *
 * @returns Health status and SQLite version string.
 */
export function runDatabaseHealthcheck() {
  const db = getDatabase()

  const result = db.prepare('SELECT sqlite_version() AS version').get() as
    { version: string } | undefined

  const version = result?.version ?? 'unknown'

  return {
    ok: true,
    version
  }
}
