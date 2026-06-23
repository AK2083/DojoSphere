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

describe('registerSessionsIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns an active session through sessions:get', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerSessionsIpc } = await import('./register')

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
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerSessionsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerSessionsIpc()

    const getHandler = getIpcHandler('sessions:get')
    const revokeHandler = getIpcHandler('sessions:revoke')
    const { sessionToken } = await createLocalUserWithSession()
    const session = (await getHandler({}, sessionToken)) as {
      id: string
      userId: string
    }

    await revokeHandler({}, sessionToken)

    expect(await getHandler({}, sessionToken)).toBeNull()

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'session'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
    }

    expect(auditRow).toMatchObject({
      action: 'revoked',
      entityType: 'session',
      entityId: session.id,
      actorUserId: session.userId
    })
  })

  it('skips audit recording when revoking an unknown session token', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerSessionsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerSessionsIpc()

    const revokeHandler = getIpcHandler('sessions:revoke')

    await revokeHandler({}, 'unknown-token')

    const auditCount = getDatabase()
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM authorization_audit_logs
        WHERE entity_type = 'session'
      `
      )
      .get() as { count: number }

    expect(auditCount.count).toBe(0)
  })
})
