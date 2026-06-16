import { DatabaseSync } from 'node:sqlite'

import type { Database } from '../types'

const BUSY_TIMEOUT_MS = 5000

/**
 * Opens a SQLite database through the Node.js built-in driver.
 * @param dbPath File path or `:memory:` for an in-memory database.
 */
export function createSqliteDatabase(dbPath: string): Database {
  return new DatabaseSync(dbPath, { timeout: BUSY_TIMEOUT_MS }) as Database
}
