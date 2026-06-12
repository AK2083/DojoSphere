import { DatabaseSync } from 'node:sqlite'

import type { SqliteDatabase } from './types/database'

const BUSY_TIMEOUT_MS = 5000

export function createDatabaseSync(dbPath: string): SqliteDatabase {
  return new DatabaseSync(dbPath, { timeout: BUSY_TIMEOUT_MS })
}
