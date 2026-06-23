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

describe('registerAuditIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('records an audit event when the session is valid', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuditIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerAuditIpc()

    const { sessionToken } = await createLocalUserWithSession()
    const recordHandler = getIpcHandler('audit:record')

    await recordHandler(
      {},
      {
        token: sessionToken,
        action: 'approved',
        entityType: 'access_request',
        entityId: 'request-1',
        newValueJson: JSON.stringify({ status: 'approved' })
      }
    )

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_id = 'request-1'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      newValueJson: string
    }

    expect(row).toMatchObject({
      action: 'approved',
      entityType: 'access_request',
      entityId: 'request-1',
      newValueJson: JSON.stringify({ status: 'approved' })
    })
  })

  it('rejects audit recording without a valid session', async () => {
    await initTestDatabase()
    const { registerAuditIpc } = await import('./register')

    registerAuditIpc()

    const recordHandler = getIpcHandler('audit:record')

    expect(() =>
      recordHandler(
        {},
        {
          token: 'invalid-token',
          action: 'approved',
          entityType: 'access_request'
        }
      )
    ).toThrow('Unauthorized')
  })

  it('rejects audit recording with empty action', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuditIpc } = await import('./register')

    registerUsersIpc()
    registerAuditIpc()

    const { sessionToken } = await createLocalUserWithSession()
    const recordHandler = getIpcHandler('audit:record')

    expect(() =>
      recordHandler(
        {},
        {
          token: sessionToken,
          action: '   ',
          entityType: 'access_request'
        }
      )
    ).toThrow('action must not be empty')
  })

  it('records an audit event with only required fields', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuditIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerAuditIpc()

    const { sessionToken } = await createLocalUserWithSession()
    const recordHandler = getIpcHandler('audit:record')

    await recordHandler(
      {},
      {
        token: sessionToken,
        action: 'revoked',
        entityType: 'session'
      }
    )

    const row = getDatabase()
      .prepare(
        `
        SELECT entity_id AS entityId, old_value_json AS oldValueJson, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE action = 'revoked' AND entity_type = 'session'
      `
      )
      .get() as {
      entityId: string | null
      oldValueJson: string | null
      newValueJson: string | null
    }

    expect(row).toEqual({
      entityId: null,
      oldValueJson: null,
      newValueJson: null
    })
  })

  it('rejects audit recording with empty entityType', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAuditIpc } = await import('./register')

    registerUsersIpc()
    registerAuditIpc()

    const { sessionToken } = await createLocalUserWithSession()
    const recordHandler = getIpcHandler('audit:record')

    expect(() =>
      recordHandler(
        {},
        {
          token: sessionToken,
          action: 'approved',
          entityType: '   '
        }
      )
    ).toThrow('entityType must not be empty')
  })
})
