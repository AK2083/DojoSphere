import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runMigrations } from './runner'

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
    expect(tables).toContain('competitors')
    expect(tables).toContain('_migrations')

    const appliedMigrations = db
      .prepare('SELECT id, name FROM _migrations ORDER BY name')
      .all() as Array<{ id: string; name: string }>

    expect(appliedMigrations).toHaveLength(7)
    expect(appliedMigrations.map((migration) => migration.name)).toEqual([
      'V001__authorize_create_tables.sql',
      'V002__authorize_seed_roles_permissions.sql',
      'V004__grades_create_table.sql',
      'V005__age_classes_create_table.sql',
      'V006__weight_classes_create_table.sql',
      'V007__clubs_create_tables.sql',
      'V008__competitors_create_table.sql'
    ])
  })

  it('is idempotent when run multiple times', () => {
    const db = createMemoryDatabase()

    runMigrations(db)
    runMigrations(db)

    const count = db.prepare('SELECT COUNT(*) AS count FROM _migrations').get() as { count: number }

    expect(count.count).toBe(7)
  })

  it('throws when a legacy users table blocks the expected schema', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')

    expect(() => runMigrations(db)).toThrow(
      'The users table exists but does not match the expected schema. A manual migration is required.'
    )
  })
})
