import { randomUUID } from 'node:crypto'

import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('permissions.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns true when the user has the permission through list_keeper', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users/repository/users.repository')
    const { userHasPermission } = await import('./permissions.repository')

    const { id: userId } = addUser({ displayName: 'List Keeper', userType: 'local' })

    expect(userHasPermission(userId, 'participants-overview', 'read')).toBe(true)
  })

  it('returns false when the user has no role assignment granting the permission', async () => {
    await initTestDatabase()
    const { getDatabase } = await import('@main/shared/database')
    const { userHasPermission } = await import('./permissions.repository')

    const userId = randomUUID()
    const db = getDatabase()

    db.prepare(
      `
      INSERT INTO users (id, display_name, email, user_type)
      VALUES (?, ?, ?, ?)
    `
    ).run(userId, 'No Role User', null, 'device')

    expect(userHasPermission(userId, 'participants-overview', 'read')).toBe(false)
  })

  it('returns false for revoked role assignments', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users/repository/users.repository')
    const { findRoleIdByName } = await import('./roles.repository')
    const { getDatabase } = await import('@main/shared/database')
    const { userHasPermission } = await import('./permissions.repository')

    const { id: userId } = addUser({ displayName: 'Revoked Keeper', userType: 'local' })
    const db = getDatabase()

    db.prepare(
      `
      UPDATE user_role_assignments
      SET revoked_at = datetime('now')
      WHERE user_id = ?
    `
    ).run(userId)

    expect(userHasPermission(userId, 'participants-overview', 'read')).toBe(false)
    expect(findRoleIdByName('list_keeper')).toEqual(expect.any(String))
  })
})
