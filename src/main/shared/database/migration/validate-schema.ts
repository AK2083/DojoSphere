import type { Database } from '../port/types'

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

/**
 * Verifies that V001 created the expected users table schema.
 * Does not mutate schema — incompatible legacy tables require a manual migration.
 */
export function assertUsersTableSchema(db: Database) {
  if (!usersTableExists(db)) {
    throw new Error('The users table is missing after migrations. Reset the local database.')
  }

  if (!usersTableHasCurrentSchema(db)) {
    throw new Error(
      'The users table exists but does not match the expected schema. A manual migration is required.'
    )
  }
}
