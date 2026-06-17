import type { Database } from './types/database'

/**
 * Applies SQLite pragmas required for safe concurrent local access.
 *
 * @param db - Database connection to configure.
 */
export function applyPragmas(db: Database) {
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA busy_timeout = 5000')
}
