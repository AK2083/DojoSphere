import path from 'node:path'
import { app } from 'electron'

import type { SqliteDatabase } from './types'

let db: SqliteDatabase | undefined

function createDatabase(dbPath: string): SqliteDatabase {
  try {
    const BetterSqlite3 = require('better-sqlite3') as typeof import('better-sqlite3')
    return new BetterSqlite3(dbPath)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.warn(`better-sqlite3 nicht verfuegbar (${errorMessage}). Nutze node:sqlite Fallback.`)

    const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite')
    return new DatabaseSync(dbPath)
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
