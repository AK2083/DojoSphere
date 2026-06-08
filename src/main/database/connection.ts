import path from 'node:path'
import { app } from 'electron'

import { createDatabaseSync } from './drivers'
import type { SqliteDatabase } from './types/database'

let db: SqliteDatabase | undefined

export function initDatabase(): SqliteDatabase {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'database.db')
  db = createDatabaseSync(dbPath)

  return db
}

export function getDatabase(): SqliteDatabase {
  if (!db) {
    throw new Error('Database wurde noch nicht initialisiert.')
  }

  return db
}

export function closeDatabase(): void {
  db?.close()
  db = undefined
}
