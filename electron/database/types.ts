import type BetterSqlite3 from 'better-sqlite3'
import type { DatabaseSync } from 'node:sqlite'

export type SqliteDatabase = BetterSqlite3.Database | DatabaseSync

export interface Migration {
  id: string
  sql: string
}
