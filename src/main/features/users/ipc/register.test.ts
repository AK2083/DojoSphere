import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import { getIpcHandler } from '../../../test/electron-mock'

describe('registerUsersIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('lists users through the users:list handler', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const addHandler = getIpcHandler('users:add')
    const listHandler = getIpcHandler('users:list')

    await addHandler({}, { displayName: 'Grace Hopper', email: 'grace@example.com' })

    const users = await listHandler()

    expect(users).toEqual([
      expect.objectContaining({
        displayName: 'Grace Hopper',
        email: 'grace@example.com',
        userType: 'local'
      })
    ])
  })

  it('returns a session token when creating a local user', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const addHandler = getIpcHandler('users:add')
    const result = await addHandler({}, { displayName: 'Local User', userType: 'local' })

    expect(result).toMatchObject({
      id: expect.any(String),
      sessionToken: expect.any(String),
      expiresAt: expect.any(String)
    })
  })

  it('does not return a session token for non-local users', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const addHandler = getIpcHandler('users:add')
    const result = await addHandler({}, { displayName: 'System Bot', userType: 'system' })

    expect(result).toEqual({
      id: expect.any(String)
    })
    expect(result).not.toHaveProperty('sessionToken')
  })

  it('ensures a local session for an existing display name without creating a duplicate user', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const addHandler = getIpcHandler('users:add')
    const ensureHandler = getIpcHandler('users:ensureLocalSession')
    const listHandler = getIpcHandler('users:list')

    await addHandler({}, { displayName: 'Local User', userType: 'local' })

    const result = await ensureHandler({}, 'Local User')

    expect(result).toMatchObject({
      id: expect.any(String),
      sessionToken: expect.any(String),
      expiresAt: expect.any(String)
    })

    const users = await listHandler()

    expect(users).toEqual([
      expect.objectContaining({
        displayName: 'Local User',
        userType: 'local'
      })
    ])
  })

  it('creates a local user and session when ensuring a new display name', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const ensureHandler = getIpcHandler('users:ensureLocalSession')
    const listHandler = getIpcHandler('users:list')

    const result = await ensureHandler({}, 'Bootstrap User')

    expect(result).toMatchObject({
      id: expect.any(String),
      sessionToken: expect.any(String),
      expiresAt: expect.any(String)
    })

    const users = await listHandler()

    expect(users).toEqual([
      expect.objectContaining({
        displayName: 'Bootstrap User',
        userType: 'local'
      })
    ])
  })

  it('updates the display name for the authenticated local session user', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const ensureHandler = getIpcHandler('users:ensureLocalSession')
    const updateHandler = getIpcHandler('users:updateDisplayName')
    const listHandler = getIpcHandler('users:list')

    const result = await ensureHandler({}, 'Local User')
    const sessionToken = (result as { sessionToken: string }).sessionToken

    const updated = await updateHandler({}, { token: sessionToken, displayName: 'Updated User' })

    expect(updated).toMatchObject({
      displayName: 'Updated User',
      userType: 'local'
    })
    expect((updated as { updatedAt: string }).updatedAt).toEqual(expect.any(String))

    const users = await listHandler()

    expect(users).toEqual([
      expect.objectContaining({
        displayName: 'Updated User',
        userType: 'local'
      })
    ])
  })

  it('rejects display name updates without a valid session token', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./register')

    registerUsersIpc()

    const updateHandler = getIpcHandler('users:updateDisplayName')

    expect(() =>
      updateHandler({}, { token: 'invalid-token', displayName: 'Updated User' })
    ).toThrow('Unauthorized')
  })
})
