import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('audit.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('inserts a row into authorization_audit_logs', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { insertAuditLog } = await import('./audit.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Audit Actor' })

    const auditId = insertAuditLog({
      actorUserId,
      action: 'updated',
      entityType: 'competitor',
      entityId: 'competitor-1',
      oldValueJson: JSON.stringify({ status: 'registered' }),
      newValueJson: JSON.stringify({ status: 'checked_in' })
    })

    const row = getDatabase()
      .prepare(
        `
        SELECT
          id,
          actor_user_id AS actorUserId,
          action,
          entity_type AS entityType,
          entity_id AS entityId,
          old_value_json AS oldValueJson,
          new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE id = ?
      `
      )
      .get(auditId) as {
      id: string
      actorUserId: string
      action: string
      entityType: string
      entityId: string
      oldValueJson: string
      newValueJson: string
    }

    expect(row).toMatchObject({
      id: auditId,
      actorUserId,
      action: 'updated',
      entityType: 'competitor',
      entityId: 'competitor-1',
      oldValueJson: JSON.stringify({ status: 'registered' }),
      newValueJson: JSON.stringify({ status: 'checked_in' })
    })
  })

  it('stores null for omitted optional columns', async () => {
    await initTestDatabase()
    const { insertAuditLog } = await import('./audit.repository')
    const { getDatabase } = await import('@main/shared/database')

    const auditId = insertAuditLog({
      actorUserId: null,
      action: 'created',
      entityType: 'session'
    })

    const row = getDatabase()
      .prepare(
        `
        SELECT entity_id AS entityId, old_value_json AS oldValueJson, new_value_json AS newValueJson,
               ip_address AS ipAddress, user_agent AS userAgent
        FROM authorization_audit_logs
        WHERE id = ?
      `
      )
      .get(auditId) as {
      entityId: string | null
      oldValueJson: string | null
      newValueJson: string | null
      ipAddress: string | null
      userAgent: string | null
    }

    expect(row).toEqual({
      entityId: null,
      oldValueJson: null,
      newValueJson: null,
      ipAddress: null,
      userAgent: null
    })
  })
})
