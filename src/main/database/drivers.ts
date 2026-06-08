import type { SqliteDatabase } from './types'

export function loadBetterSqlite3Database(dbPath: string): SqliteDatabase {
  const BetterSqlite3 = require('better-sqlite3') as typeof import('better-sqlite3')
  return new BetterSqlite3(dbPath)
}

export function loadNodeSqliteDatabase(dbPath: string): SqliteDatabase {
  const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite')
  return new DatabaseSync(dbPath)
}
