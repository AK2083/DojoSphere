import type { Database } from './types/database'

/**
 * Runs the given callback inside a SQL transaction and rolls back on failure.
 *
 * @param db - Database connection to use for the transaction.
 * @param fn - Callback containing SQL statements to execute atomically.
 */
export function runInTransaction(db: Database, fn: () => void) {
  db.exec('BEGIN')
  try {
    fn()
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
