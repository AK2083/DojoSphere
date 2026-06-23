import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('record-competitor-events', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('records competitor creation audit events without PII values', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordCompetitorCreated } = await import('./record-competitor-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Competitor Actor', userType: 'system' })

    recordCompetitorCreated({ actorUserId, competitorId: 'competitor-1' })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'created'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
      newValueJson: string
    }

    expect(row).toMatchObject({
      action: 'created',
      entityType: 'competitor',
      entityId: 'competitor-1',
      actorUserId,
      newValueJson: JSON.stringify({
        fields: ['given_name', 'family_name', 'club', 'weight_class']
      })
    })
    expect(row.newValueJson).not.toContain('Test')
  })

  it('records competitor update audit events with changed field names only', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordCompetitorUpdated } = await import('./record-competitor-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })

    recordCompetitorUpdated({
      actorUserId,
      competitorId: 'competitor-1',
      changedFields: ['club', 'weight_class']
    })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { action: string; newValueJson: string }

    expect(row).toMatchObject({
      action: 'updated',
      newValueJson: JSON.stringify({ changed_fields: ['club', 'weight_class'] })
    })
  })

  it('records competitor deletion audit events', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordCompetitorDeleted } = await import('./record-competitor-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })

    recordCompetitorDeleted({ actorUserId, competitorId: 'competitor-1' })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'deleted'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
    }

    expect(row).toMatchObject({
      action: 'deleted',
      entityType: 'competitor',
      entityId: 'competitor-1',
      actorUserId
    })
  })
})
