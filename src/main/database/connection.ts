import path from 'node:path'
import { app } from 'electron'

import { loadBetterSqlite3Database, loadNodeSqliteDatabase } from './drivers'
import type { SqliteDatabase } from './types'

let db: SqliteDatabase | undefined

function createDatabase(dbPath: string): SqliteDatabase {
  try {
    return loadBetterSqlite3Database(dbPath)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.warn(`better-sqlite3 nicht verfuegbar (${errorMessage}). Nutze node:sqlite Fallback.`)

    return loadNodeSqliteDatabase(dbPath)
  }
}

export function initDatabase(): SqliteDatabase {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'database.db')
  db = createDatabase(dbPath)

  return db
}

export function getDatabase(): SqliteDatabase {
  if (!db) {
    throw new Error('Database wurde noch nicht initialisiert.')
  }

  return db
}

export function closeDatabase(): void {
  if (db && 'close' in db && typeof db.close === 'function') {
    db.close()
  }

  db = undefined
}
