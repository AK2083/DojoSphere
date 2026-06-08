import type { SqliteDatabase } from './types/database'

export function runInTransaction(db: SqliteDatabase, fn: () => void) {
  if ('transaction' in db && typeof db.transaction === 'function') {
    return db.transaction(fn)()
  }

  db.exec('BEGIN')
  try {
    fn()
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
