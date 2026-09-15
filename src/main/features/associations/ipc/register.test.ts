import type { AddUserResult, Association } from '@shared/types/electron-api'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import { getIpcHandler } from '../../../test/electron-mock'
import { UNKNOWN_ASSOCIATION_ID } from '../../../shared/database/reference-seed-ids'

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

function validAssociationPayload(associationNumber = 'VR 20123 P') {
  return {
    name: 'Judoclub Nord e.V.',
    identifiers: [
      {
        type: 'vereinsregister_number',
        value: associationNumber,
        authority: null
      }
    ],
    addresses: [
      {
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg',
        addressType: 'primary'
      }
    ],
    contacts: [
      {
        contactType: 'email',
        value: 'info@example.com',
        isPublic: true
      }
    ]
  }
}

describe('registerAssociationsIpc', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  it('adds an association through associations:add and records audit', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerAssociationsIpc()

    const addHandler = getIpcHandler('associations:add')
    const { sessionToken, id: actorUserId } = await createLocalUserWithSession()

    const association = (await addHandler(
      {},
      { token: sessionToken, ...validAssociationPayload() }
    )) as Association

    expect(association).toMatchObject({
      name: 'Judoclub Nord e.V.',
      districtName: 'Placeholder District'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'association' AND action = 'created'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
    }

    expect(auditRow).toMatchObject({
      action: 'created',
      entityType: 'association',
      entityId: association.id,
      actorUserId
    })
  })

  it('lists associations through associations:list', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const addHandler = getIpcHandler('associations:add')
    const listHandler = getIpcHandler('associations:list')
    const { sessionToken } = await createLocalUserWithSession()

    await addHandler({}, { token: sessionToken, ...validAssociationPayload() })

    const associations = await listHandler({}, sessionToken)

    expect(associations).toEqual([
      expect.objectContaining({
        name: 'Judoclub Nord e.V.',
        districtName: 'Placeholder District'
      })
    ])
  })

  it('returns an association through associations:get', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const addHandler = getIpcHandler('associations:add')
    const getHandler = getIpcHandler('associations:get')
    const { sessionToken } = await createLocalUserWithSession()

    const created = (await addHandler(
      {},
      { token: sessionToken, ...validAssociationPayload() }
    )) as Association

    const association = await getHandler({}, { token: sessionToken, id: created.id })

    expect(association).toMatchObject({
      id: created.id,
      name: 'Judoclub Nord e.V.'
    })
  })

  it('updates an association through associations:update', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const addHandler = getIpcHandler('associations:add')
    const updateHandler = getIpcHandler('associations:update')
    const { sessionToken } = await createLocalUserWithSession()

    const created = (await addHandler(
      {},
      { token: sessionToken, ...validAssociationPayload() }
    )) as Association

    const updated = await updateHandler(
      {},
      {
        token: sessionToken,
        id: created.id,
        name: 'Judoclub Nord Updated'
      }
    )

    expect(updated).toMatchObject({
      id: created.id,
      name: 'Judoclub Nord Updated'
    })
  })

  it('deletes an association through associations:delete', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')
    const { getAssociation } = await import('../repository/associations.repository')

    registerUsersIpc()
    registerAssociationsIpc()

    const addHandler = getIpcHandler('associations:add')
    const deleteHandler = getIpcHandler('associations:delete')
    const { sessionToken } = await createLocalUserWithSession()

    const created = (await addHandler(
      {},
      { token: sessionToken, ...validAssociationPayload('030001'), name: 'Temporary Association' }
    )) as Association

    await deleteHandler({}, { token: sessionToken, id: created.id })

    expect(getAssociation(created.id)).toBeNull()
  })

  it('rejects associations:get for a missing id', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const getHandler = getIpcHandler('associations:get')
    const { sessionToken } = await createLocalUserWithSession()

    expect(() => getHandler({}, { token: sessionToken, id: 'missing-id' })).toThrow(
      'Association not found'
    )
  })

  it('rejects associations:list without a valid session', async () => {
    await initTestDatabase()
    const { registerAssociationsIpc } = await import('./register')

    registerAssociationsIpc()

    const listHandler = getIpcHandler('associations:list')

    expect(() => listHandler({}, 'invalid-token')).toThrow('Unauthorized')
  })

  it('can read the seeded Unknown association by id', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const getHandler = getIpcHandler('associations:get')
    const { sessionToken } = await createLocalUserWithSession()

    const association = await getHandler(
      {},
      {
        token: sessionToken,
        id: UNKNOWN_ASSOCIATION_ID
      }
    )

    expect(association).toMatchObject({
      id: UNKNOWN_ASSOCIATION_ID,
      name: 'Unknown',
      source: 'seed'
    })
  })
})
