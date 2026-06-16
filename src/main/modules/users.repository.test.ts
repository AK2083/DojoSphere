import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'

describe('users.repository', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
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
    const { findRoleIdByName } = await import('./roles.repository')
    const { getDatabase } = await import('@main/shared/database')

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
      roleId: findRoleIdByName('list_keeper'),
      scopeType: 'global',
      revokedAt: null
    })
  })

  it('stores optional fields with defaults', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')
    const { getDatabase } = await import('@main/shared/database')

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

  it('finds a local user by display name', async () => {
    await initTestDatabase()
    const { addUser, findLocalUserByDisplayName } = await import('./users.repository')

    addUser({ displayName: 'Ada Lovelace' })

    expect(findLocalUserByDisplayName('Ada Lovelace')).toMatchObject({
      displayName: 'Ada Lovelace',
      userType: 'local'
    })
    expect(findLocalUserByDisplayName('Missing User')).toBeNull()
  })

  it('does not match non-local users by display name', async () => {
    await initTestDatabase()
    const { addUser, findLocalUserByDisplayName } = await import('./users.repository')

    addUser({ displayName: 'System Bot', userType: 'system' })

    expect(findLocalUserByDisplayName('System Bot')).toBeNull()
  })

  it('reuses an existing local user when ensuring a session', async () => {
    await initTestDatabase()
    const { addUser, ensureLocalUserSession, getUsers } = await import('./users.repository')

    addUser({ displayName: 'Local User', userType: 'local' })

    const result = ensureLocalUserSession('Local User')

    expect(result).toMatchObject({
      id: expect.any(String),
      sessionToken: expect.any(String),
      expiresAt: expect.any(String)
    })
    expect(getUsers()).toHaveLength(1)
  })

  it('creates a local user when ensuring a session for a new display name', async () => {
    await initTestDatabase()
    const { ensureLocalUserSession, getUsers } = await import('./users.repository')

    const result = ensureLocalUserSession('New Local User')

    expect(result).toMatchObject({
      id: expect.any(String),
      sessionToken: expect.any(String),
      expiresAt: expect.any(String)
    })
    expect(getUsers()).toEqual([
      expect.objectContaining({
        displayName: 'New Local User',
        userType: 'local'
      })
    ])
  })

  it('updates a user display name and sets updated_at', async () => {
    await initTestDatabase()
    const { addUser, getUsers, updateUserDisplayName } = await import('./users.repository')

    const { id } = addUser({ displayName: 'Ada Lovelace' })

    const updated = updateUserDisplayName(id, '  Grace Hopper  ')

    expect(updated).toMatchObject({
      id,
      displayName: 'Grace Hopper',
      userType: 'local'
    })
    expect(updated.updatedAt).toEqual(expect.any(String))
    expect(getUsers()[0]).toMatchObject({
      displayName: 'Grace Hopper'
    })
  })

  it('throws when updating with an empty display name', async () => {
    await initTestDatabase()
    const { addUser, updateUserDisplayName } = await import('./users.repository')

    const { id } = addUser({ displayName: 'Ada Lovelace' })

    expect(() => updateUserDisplayName(id, '   ')).toThrow('Display name must not be empty')
  })

  it('throws when updating an unknown user id', async () => {
    await initTestDatabase()
    const { updateUserDisplayName } = await import('./users.repository')

    expect(() => updateUserDisplayName('missing-user-id', 'Ada Lovelace')).toThrow('User not found')
  })

  it('throws when the user row disappears after update', async () => {
    await initTestDatabase()
    const { addUser, updateUserDisplayName } = await import('./users.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id } = addUser({ displayName: 'Ada Lovelace' })
    const db = getDatabase()
    const originalPrepare = db.prepare.bind(db)

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      const statement = originalPrepare(sql)

      if (!sql.includes('UPDATE users')) {
        return statement
      }

      return {
        run: (...args: unknown[]) => {
          const result = statement.run(args[0] as string, args[1] as string)

          vi.spyOn(db, 'prepare').mockImplementation((innerSql: string) => {
            if (innerSql.includes('SELECT') && innerSql.includes('WHERE id = ?')) {
              return {
                get: () => undefined
              } as never
            }

            return originalPrepare(innerSql)
          })

          return result
        }
      } as never
    })

    expect(() => updateUserDisplayName(id, 'Grace Hopper')).toThrow('User not found')
  })
})
