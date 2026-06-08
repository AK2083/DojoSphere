import type { SqliteDatabase } from './types/database'

export function applyPragmas(db: SqliteDatabase) {
  if ('pragma' in db && typeof db.pragma === 'function') {
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.pragma('busy_timeout = 5000')
    return
  }

  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA busy_timeout = 5000')
}
