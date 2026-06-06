import migrations from './migrations'
import type { SqliteDatabase } from './types'

function applyPragmas(db: SqliteDatabase) {
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

function ensureMigrationsTable(db: SqliteDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}

function runInTransaction(db: SqliteDatabase, fn: () => void) {
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

export function runMigrations(db: SqliteDatabase) {
  applyPragmas(db)
  ensureMigrationsTable(db)

  const applied = new Set(
    db
      .prepare('SELECT id FROM _migrations')
      .all()
      .map((row) => (row as { id: string }).id)
  )

  const insertMigration = db.prepare('INSERT INTO _migrations (id) VALUES (?)')

  for (const { id, sql } of migrations) {
    if (applied.has(id)) continue

    runInTransaction(db, () => {
      db.exec(sql)
      insertMigration.run(id)
    })
  }
}
