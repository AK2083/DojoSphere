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
})
