import type { AddUserResult } from '@shared/types/electron-api'
import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import { getIpcHandler } from '../../../test/electron-mock'

async function createLocalUserWithSession() {
  const addHandler = getIpcHandler('users:add')
  const result = (await addHandler(
    {},
    {
      displayName: 'Local User',
      userType: 'local'
    }
  )) as AddUserResult

  if (!result.sessionToken) {
    throw new Error('Expected local user creation to return a session token.')
  }

  return result
}

describe('registerAuthorizationIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns true for list_keeper permissions through authorization:hasPermission', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuthorizationIpc } = await import('./register')

    registerUsersIpc()
    registerAuthorizationIpc()

    const { sessionToken } = await createLocalUserWithSession()
    const hasPermissionHandler = getIpcHandler('authorization:hasPermission')

    expect(
      await hasPermissionHandler(
        {},
        {
          token: sessionToken,
          resource: 'participants-overview',
          action: 'read'
        }
      )
    ).toBe(true)
  })

  it('returns false when the user lacks the permission', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuthorizationIpc } = await import('./register')
    const { createSession } = await import('@main/features/sessions')

    registerUsersIpc()
    registerAuthorizationIpc()

    const addHandler = getIpcHandler('users:add')
    const { id: userId } = (await addHandler(
      {},
      {
        displayName: 'Device User',
        userType: 'device'
      }
    )) as AddUserResult
    const { token: sessionToken } = createSession(userId)
    const hasPermissionHandler = getIpcHandler('authorization:hasPermission')

    expect(
      await hasPermissionHandler(
        {},
        {
          token: sessionToken,
          resource: 'participants-overview',
          action: 'read'
        }
      )
    ).toBe(false)
  })

  it('rejects authorization:hasPermission without a valid session', async () => {
    await initTestDatabase()
    const { registerAuthorizationIpc } = await import('./register')

    registerAuthorizationIpc()

    const hasPermissionHandler = getIpcHandler('authorization:hasPermission')

    expect(() =>
      hasPermissionHandler(
        {},
        {
          token: 'invalid-token',
          resource: 'participants-overview',
          action: 'read'
        }
      )
    ).toThrow('Unauthorized')
  })
})
