import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runMigrations } from './runner'
import { assertUsersTableSchema } from './validate-schema'

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
