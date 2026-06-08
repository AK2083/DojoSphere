import type { SqliteDatabase } from './types/database'

export function applyPragmas(db: SqliteDatabase) {
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA busy_timeout = 5000')
}
