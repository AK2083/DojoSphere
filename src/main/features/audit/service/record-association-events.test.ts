import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('record-association-events', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('records association creation audit events without PII values', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordAssociationCreated } = await import('./record-association-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Association Actor', userType: 'system' })

    recordAssociationCreated({ actorUserId, associationId: 'association-1' })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'association' AND action = 'created'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      newValueJson: string
    }

    expect(row).toMatchObject({
      action: 'created',
      entityType: 'association',
      entityId: 'association-1'
    })
    expect(JSON.parse(row.newValueJson)).toEqual({
      fields: [
        'name',
        'short_name',
        'city',
        'website',
        'is_active',
        'district',
        'identifiers',
        'addresses',
        'contacts'
      ]
    })
  })

  it('records association update audit events with changed field names only', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordAssociationUpdated } = await import('./record-association-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Association Actor', userType: 'system' })

    recordAssociationUpdated({
      actorUserId,
      associationId: 'association-1',
      changedFields: ['name', 'district']
    })

    const row = getDatabase()
      .prepare(
        `
        SELECT new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'association' AND action = 'updated'
      `
      )
      .get() as { newValueJson: string }

    expect(JSON.parse(row.newValueJson)).toEqual({ changed_fields: ['name', 'district'] })
  })

  it('records association deletion audit events', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { recordAssociationDeleted } = await import('./record-association-events')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Association Actor', userType: 'system' })

    recordAssociationDeleted({ actorUserId, associationId: 'association-1' })

    const row = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId
        FROM authorization_audit_logs
        WHERE entity_type = 'association' AND action = 'deleted'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
    }

    expect(row).toMatchObject({
      action: 'deleted',
      entityType: 'association',
      entityId: 'association-1'
    })
  })
})
