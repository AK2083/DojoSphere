import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('ensureLocalUserSession', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('reuses an existing local user when ensuring a session', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('../repository/users.repository')
    const { ensureLocalUserSession } = await import('./ensure-local-user-session')

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
    const { getUsers } = await import('../repository/users.repository')
    const { ensureLocalUserSession } = await import('./ensure-local-user-session')

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
})
