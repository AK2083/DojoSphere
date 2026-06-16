import type { Database } from './types'

const CREATE_USERS_TABLE_SQL = `
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    email TEXT,
    user_type TEXT NOT NULL DEFAULT 'local'
      CHECK (user_type IN ('local', 'device', 'system')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
  )
`

function usersTableHasCurrentSchema(db: Database) {
  const columns = db.prepare("PRAGMA table_info('users')").all() as Array<{ name: string }>

  return (
    columns.some((column) => column.name === 'display_name') &&
    columns.some((column) => column.name === 'user_type')
  )
}

export function ensureUsersTable(db: Database) {
  if (usersTableHasCurrentSchema(db)) {
    return
  }

  db.exec('DROP TABLE IF EXISTS users')
  db.exec(CREATE_USERS_TABLE_SQL)
}
