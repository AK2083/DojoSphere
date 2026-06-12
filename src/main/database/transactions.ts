import type { SqliteDatabase } from './types/database'

export function runInTransaction(db: SqliteDatabase, fn: () => void) {
  db.exec('BEGIN')
  try {
    fn()
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
