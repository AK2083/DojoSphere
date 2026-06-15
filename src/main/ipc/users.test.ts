import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'
import { getIpcHandler } from '../test/electron-mock'

describe('registerUsersIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('lists users through the users:list handler', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./users')

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
    const { registerUsersIpc } = await import('./users')

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
    const { registerUsersIpc } = await import('./users')

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
    const { registerUsersIpc } = await import('./users')

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
    const { registerUsersIpc } = await import('./users')

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
})
