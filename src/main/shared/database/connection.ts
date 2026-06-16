import path from 'node:path'
import { app } from 'electron'

import { createSqliteDatabase } from './sqlite/driver'
import type { Database } from './types'

let db: Database | undefined

export function initDatabase(): Database {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'database.db')
  db = createSqliteDatabase(dbPath)

  return db
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database wurde noch nicht initialisiert.')
  }

  return db
}

export function closeDatabase(): void {
  db?.close()
  db = undefined
}

/**
 * Creates an in-memory database for tests and tooling.
 */
export function createMemoryDatabase(): Database {
  return createSqliteDatabase(':memory:')
}
