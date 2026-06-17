import path from 'node:path'
import { app } from 'electron'

import { createSqliteDatabase } from './driver'
import type { Database } from './types/database'

let db: Database | undefined

/**
 * Opens the application database under Electron userData and returns the singleton instance.
 *
 * @returns The initialized database connection.
 */
export function initDatabase(): Database {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'database.db')
  db = createSqliteDatabase(dbPath)

  return db
}

/**
 * Returns the active application database connection.
 *
 * @returns The initialized database connection.
 * @throws {Error} When {@link initDatabase} has not been called yet.
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database has not been initialized yet.')
  }

  return db
}

/**
 * Closes the application database connection and clears the singleton.
 */
export function closeDatabase(): void {
  db?.close()
  db = undefined
}

/**
 * Creates an in-memory database for tests and tooling.
 *
 * @returns A new in-memory database connection.
 */
export function createMemoryDatabase(): Database {
  return createSqliteDatabase(':memory:')
}
