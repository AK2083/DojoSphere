import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runMigrations } from './runner'

describe('updated_at triggers', () => {
  it('sets updated_at on users and clubs when a row is updated', () => {
    const db = createMemoryDatabase()
    runMigrations(db)

    const userId = 'user-trigger-test'
    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Before', 'local')
    `
    ).run(userId)

    const userBefore = db
      .prepare('SELECT updated_at AS updatedAt FROM users WHERE id = ?')
      .get(userId) as { updatedAt: string | null }

    expect(userBefore.updatedAt).toBeNull()

    db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run('After', userId)

    const userAfter = db
      .prepare('SELECT updated_at AS updatedAt FROM users WHERE id = ?')
      .get(userId) as { updatedAt: string | null }

    expect(userAfter.updatedAt).toEqual(expect.any(String))

    const clubId = '00000000-0000-0000-0000-000000000000'
    const clubBefore = db
      .prepare('SELECT updated_at AS updatedAt FROM clubs WHERE id = ?')
      .get(clubId) as { updatedAt: string | null }

    expect(clubBefore.updatedAt).toBeNull()

    db.prepare('UPDATE clubs SET name = ? WHERE id = ?').run('Unknown Club', clubId)

    const clubAfter = db
      .prepare('SELECT updated_at AS updatedAt FROM clubs WHERE id = ?')
      .get(clubId) as { updatedAt: string | null }

    expect(clubAfter.updatedAt).toEqual(expect.any(String))
  })

  it('does not override an explicitly set updated_at value', () => {
    const db = createMemoryDatabase()
    runMigrations(db)

    const userId = 'user-explicit-updated-at'
    db.prepare(
      `
      INSERT INTO users (id, display_name, user_type)
      VALUES (?, 'Before', 'local')
    `
    ).run(userId)

    db.prepare(
      `
      UPDATE users
      SET display_name = ?, updated_at = ?
      WHERE id = ?
    `
    ).run('After', '2020-01-01T00:00:00.000Z', userId)

    const user = db
      .prepare('SELECT updated_at AS updatedAt FROM users WHERE id = ?')
      .get(userId) as { updatedAt: string | null }

    expect(user.updatedAt).toBe('2020-01-01T00:00:00.000Z')
  })
})
