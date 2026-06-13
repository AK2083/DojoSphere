import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../test/database'
import { ensureUsersTable } from './ensure-users-table'
import { runMigrations } from './migrate'

describe('ensureUsersTable', () => {
  it('creates the users table when it is missing', () => {
    const db = createMemoryDatabase()

    ensureUsersTable(db)

    const columns = db
      .prepare("PRAGMA table_info('users')")
      .all()
      .map((row) => (row as { name: string }).name)

    expect(columns).toContain('display_name')
    expect(columns).toContain('user_type')
  })

  it('replaces a legacy users table with the current schema', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, data JSON)')

    ensureUsersTable(db)

    const columns = db
      .prepare("PRAGMA table_info('users')")
      .all()
      .map((row) => (row as { name: string }).name)

    expect(columns).toContain('display_name')
    expect(columns).not.toContain('name')
  })
})

describe('runMigrations', () => {
  it('creates schema tables and records applied migrations', () => {
    const db = createMemoryDatabase()

    runMigrations(db)

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all()
      .map((row) => (row as { name: string }).name)

    expect(tables).toContain('users')
    expect(tables).toContain('roles')
    expect(tables).toContain('_migrations')

    const appliedMigrations = db
      .prepare('SELECT id, name FROM _migrations ORDER BY name')
      .all() as Array<{ id: string; name: string }>

    expect(appliedMigrations).toHaveLength(2)
    expect(appliedMigrations.map((migration) => migration.name)).toEqual([
      'V001__authorize_create_tables.sql',
      'V002__authorize_seed_roles_permissions.sql'
    ])
  })

  it('is idempotent when run multiple times', () => {
    const db = createMemoryDatabase()

    runMigrations(db)
    runMigrations(db)

    const count = db.prepare('SELECT COUNT(*) AS count FROM _migrations').get() as { count: number }

    expect(count.count).toBe(2)
  })

  it('repairs a database where migrations ran but users is missing', () => {
    const db = createMemoryDatabase()

    db.exec(`
      CREATE TABLE _migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    db.exec(`
      INSERT INTO _migrations (id, name) VALUES
        ('8f3c2a1b-4d5e-6f70-8192-a3b4c5d6e701', 'V001__authorize_create_tables.sql'),
        ('9a4d3b2c-5e6f-7081-92a3-b4c5d6e7f802', 'V002__authorize_seed_roles_permissions.sql')
    `)
    db.exec('CREATE TABLE user_role_assignments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL)')

    runMigrations(db)

    const usersTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
      .get()

    expect(usersTable).toBeDefined()
  })
})
