import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../../test/database'

import { assertUsersTableSchema } from './validate-schema'
import { runMigrations } from './runner'

describe('assertUsersTableSchema', () => {
  it('accepts the users table created by migrations', () => {
    const db = createMemoryDatabase()

    runMigrations(db)

    expect(() => assertUsersTableSchema(db)).not.toThrow()
  })

  it('throws when the users table is missing', () => {
    const db = createMemoryDatabase()

    expect(() => assertUsersTableSchema(db)).toThrow(
      'The users table is missing after migrations. Reset the local database.'
    )
  })

  it('throws when a legacy users table exists', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, data JSON)')

    expect(() => assertUsersTableSchema(db)).toThrow(
      'The users table exists but does not match the expected schema. A manual migration is required.'
    )
  })

  it('does not drop existing user data when the schema is incompatible', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, data JSON)')
    db.exec("INSERT INTO users (id, name) VALUES (1, 'Legacy User')")

    expect(() => assertUsersTableSchema(db)).toThrow()

    const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }

    expect(userCount.count).toBe(1)
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

  it('throws when a legacy users table blocks the expected schema', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')

    expect(() => runMigrations(db)).toThrow(
      'The users table exists but does not match the expected schema. A manual migration is required.'
    )
  })
})
