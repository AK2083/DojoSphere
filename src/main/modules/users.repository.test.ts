import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'

describe('users.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns an empty list before users are added', async () => {
    await initTestDatabase()
    const { getUsers } = await import('./users.repository')

    expect(getUsers()).toEqual([])
  })

  it('persists and returns created users', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')

    addUser({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com'
    })

    const users = getUsers()

    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      userType: 'local'
    })
    expect(users[0]?.id).toEqual(expect.any(String))
    expect(users[0]?.createdAt).toEqual(expect.any(String))
  })

  it('assigns the list_keeper role to local users', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')
    const { LIST_KEEPER_ROLE_ID } = await import('../database/seeded-roles')
    const { getDatabase } = await import('../database/connection')

    addUser({ displayName: 'Local User' })

    const userId = getUsers()[0]?.id
    const assignment = getDatabase()
      .prepare(
        `
        SELECT role_id AS roleId, scope_type AS scopeType, revoked_at AS revokedAt
        FROM user_role_assignments
        WHERE user_id = ?
      `
      )
      .get(userId) as { roleId: string; scopeType: string; revokedAt: string | null }

    expect(assignment).toMatchObject({
      roleId: LIST_KEEPER_ROLE_ID,
      scopeType: 'global',
      revokedAt: null
    })
  })

  it('stores optional fields with defaults', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')
    const { getDatabase } = await import('../database/connection')

    addUser({
      displayName: 'System Bot',
      userType: 'system'
    })

    expect(getUsers()[0]).toMatchObject({
      displayName: 'System Bot',
      email: null,
      userType: 'system'
    })

    const assignmentCount = getDatabase()
      .prepare('SELECT COUNT(*) AS count FROM user_role_assignments')
      .get() as { count: number }

    expect(assignmentCount.count).toBe(0)
  })
})
