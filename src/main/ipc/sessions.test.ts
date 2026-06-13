import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'
import { getIpcHandler } from '../test/electron-mock'

describe('registerSessionsIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns an active session through sessions:get', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./users')
    const { registerSessionsIpc } = await import('./sessions')

    registerUsersIpc()
    registerSessionsIpc()

    const addHandler = getIpcHandler('users:add')
    const getHandler = getIpcHandler('sessions:get')
    const result = await addHandler({}, { displayName: 'Local User', userType: 'local' })

    const session = await getHandler({}, result.sessionToken)

    expect(session).toMatchObject({
      user: {
        displayName: 'Local User',
        userType: 'local'
      }
    })
  })

  it('revokes a session through sessions:revoke', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('./users')
    const { registerSessionsIpc } = await import('./sessions')

    registerUsersIpc()
    registerSessionsIpc()

    const addHandler = getIpcHandler('users:add')
    const getHandler = getIpcHandler('sessions:get')
    const revokeHandler = getIpcHandler('sessions:revoke')
    const result = await addHandler({}, { displayName: 'Local User', userType: 'local' })

    await revokeHandler({}, result.sessionToken)

    expect(await getHandler({}, result.sessionToken)).toBeNull()
  })
})
