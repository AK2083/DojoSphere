import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('record-authorization-events', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('records session revocation audit events', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { createSession } = await import('@main/features/sessions')
    const { recordSessionRevoked } = await import('./record-authorization-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: userId } = addUser({ displayName: 'Session Actor' })
    const session = createSession(userId)

    recordSessionRevoked({ id: session.id, userId })

    const row = getDatabase()
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

    expect(row).toMatchObject({
      action: 'revoked',
      entityType: 'session',
      entityId: session.id,
      actorUserId: userId
    })
  })

  it('records role assignment audit events', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { findRoleIdByName } = await import('@main/features/authorization')
    const { recordRoleAssigned } = await import('./record-authorization-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: userId } = addUser({ displayName: 'Role Actor', userType: 'system' })

    recordRoleAssigned({
      actorUserId: userId,
      roleId: findRoleIdByName('list_keeper'),
      userId,
      assignmentId: 'assignment-1',
      scopeType: 'global'
    })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_id = ?
      `
      )
      .get(findRoleIdByName('list_keeper')) as {
      action: string
      entityType: string
      entityId: string
      newValueJson: string
    }

    expect(row).toMatchObject({
      action: 'assigned',
      entityType: 'role',
      entityId: findRoleIdByName('list_keeper'),
      newValueJson: JSON.stringify({
        user_id: userId,
        assignment_id: 'assignment-1',
        scope_type: 'global'
      })
    })
  })
})
