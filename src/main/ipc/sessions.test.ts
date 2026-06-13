import type { AddUserResult } from '@shared/types/electron-api'
import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'
import { getIpcHandler } from '../test/electron-mock'

async function createLocalUserWithSession() {
  const addHandler = getIpcHandler('users:add')
  const result = (await addHandler({}, {
    displayName: 'Local User',
    userType: 'local'
  })) as AddUserResult

  if (!result.sessionToken) {
    throw new Error('Expected local user creation to return a session token.')
  }

  return result
}

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

    const getHandler = getIpcHandler('sessions:get')
    const { sessionToken } = await createLocalUserWithSession()

    const session = await getHandler({}, sessionToken)

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

    const getHandler = getIpcHandler('sessions:get')
    const revokeHandler = getIpcHandler('sessions:revoke')
    const { sessionToken } = await createLocalUserWithSession()

    await revokeHandler({}, sessionToken)

    expect(await getHandler({}, sessionToken)).toBeNull()
  })
})
