import migrations from './migrations'
import { ensureUsersTable } from './ensure-users-table'
import { applyPragmas } from './pragmas'
import { runInTransaction } from './transactions'
import type { Database } from './types'

function ensureMigrationsTable(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}

function getAppliedMigrationIds(db: Database) {
  return new Set(
    db
      .prepare('SELECT id FROM _migrations')
      .all()
      .map((row) => (row as { id: string }).id)
  )
}

export function runMigrations(db: Database) {
  applyPragmas(db)
  ensureMigrationsTable(db)

  const applied = getAppliedMigrationIds(db)
  const insertMigration = db.prepare('INSERT INTO _migrations (id, name) VALUES (?, ?)')
  const sortedMigrations = [...migrations].sort((a, b) => a.name.localeCompare(b.name))

  for (const { id, name, sql } of sortedMigrations) {
    if (applied.has(id)) continue

    runInTransaction(db, () => {
      db.exec(sql)
      insertMigration.run(id, name)
    })
  }

  ensureUsersTable(db)
}
