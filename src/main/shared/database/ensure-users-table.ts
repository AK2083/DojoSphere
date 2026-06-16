import type { Database } from './types'

const CREATE_USERS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    email TEXT,
    user_type TEXT NOT NULL DEFAULT 'local'
      CHECK (user_type IN ('local', 'device', 'system')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
  )
`

function usersTableExists(db: Database) {
  return Boolean(
    db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'").get()
  )
}

function usersTableHasCurrentSchema(db: Database) {
  const columns = db.prepare("PRAGMA table_info('users')").all() as Array<{ name: string }>

  return (
    columns.some((column) => column.name === 'display_name') &&
    columns.some((column) => column.name === 'user_type')
  )
}

export function ensureUsersTable(db: Database) {
  if (!usersTableExists(db)) {
    db.exec(CREATE_USERS_TABLE_SQL)
    return
  }

  if (usersTableHasCurrentSchema(db)) {
    return
  }

  throw new Error(
    'The users table exists but does not match the expected schema. A manual migration is required.'
  )
}
