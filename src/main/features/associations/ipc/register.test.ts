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

  // -------------------------------------------------------------------------
  // Sync IPC handlers
  // -------------------------------------------------------------------------

  it('returns null timestamps through associations:getSyncTimestamps on a fresh database', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const timestampsHandler = getIpcHandler('associations:getSyncTimestamps')
    const { sessionToken } = await createLocalUserWithSession()

    const timestamps = await timestampsHandler({}, sessionToken)

    expect(timestamps).toEqual({
      countries: null,
      federations: null,
      regionalFederations: null,
      districts: null,
      associations: null
    })
  })

  it('rejects associations:getSyncTimestamps without a valid session', async () => {
    await initTestDatabase()
    const { registerAssociationsIpc } = await import('./register')

    registerAssociationsIpc()

    const timestampsHandler = getIpcHandler('associations:getSyncTimestamps')

    expect(() => timestampsHandler({}, 'invalid-token')).toThrow('Unauthorized')
  })

  it('upserts hierarchy rows through associations:applySync', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerAssociationsIpc()

    const applyHandler = getIpcHandler('associations:applySync')
    const { sessionToken } = await createLocalUserWithSession()

    const senderMock = { send: vi.fn() }

    await applyHandler(
      { sender: senderMock },
      {
        token: sessionToken,
        payload: {
          countries: [
            {
              id: 'ff000000-0000-4000-8000-000000000001',
              name: 'IPC Country',
              isoCode: 'IC',
              updatedAt: null
            }
          ],
          federations: [
            {
              id: 'ff000000-0000-4000-8000-000000000002',
              countryId: 'ff000000-0000-4000-8000-000000000001',
              name: 'IPC Federation',
              shortName: null,
              website: null,
              updatedAt: null
            }
          ],
          regionalFederations: [
            {
              id: 'ff000000-0000-4000-8000-000000000003',
              federationId: 'ff000000-0000-4000-8000-000000000002',
              name: 'IPC RF',
              shortName: null,
              website: null,
              updatedAt: null
            }
          ],
          districts: [
            {
              id: 'ff000000-0000-4000-8000-000000000004',
              regionalFederationId: 'ff000000-0000-4000-8000-000000000003',
              name: 'IPC District',
              shortName: null,
              sortOrder: 1,
              updatedAt: null
            }
          ],
          associations: []
        }
      }
    )

    const country = getDatabase()
      .prepare('SELECT name FROM countries WHERE id = ?')
      .get('ff000000-0000-4000-8000-000000000001') as { name: string } | undefined

    expect(country?.name).toBe('IPC Country')
  })

  it('rejects associations:applySync without a valid session', async () => {
    await initTestDatabase()
    const { registerAssociationsIpc } = await import('./register')

    registerAssociationsIpc()

    const applyHandler = getIpcHandler('associations:applySync')

    expect(() =>
      applyHandler(
        { sender: { send: vi.fn() } },
        {
          token: 'invalid-token',
          payload: {
            countries: [],
            federations: [],
            regionalFederations: [],
            districts: [],
            associations: []
          }
        }
      )
    ).toThrow('Unauthorized')
  })

  it('returns updated timestamps through associations:getSyncTimestamps after a sync', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerAssociationsIpc } = await import('./register')

    registerUsersIpc()
    registerAssociationsIpc()

    const timestampsHandler = getIpcHandler('associations:getSyncTimestamps')
    const applyHandler = getIpcHandler('associations:applySync')
    const { sessionToken } = await createLocalUserWithSession()

    // Before sync – all null
    const before = await timestampsHandler({}, sessionToken)
    expect((before as { countries: string | null }).countries).toBeNull()

    // Apply a sync batch
    await applyHandler(
      { sender: { send: vi.fn() } },
      {
        token: sessionToken,
        payload: {
          countries: [
            {
              id: 'gg000000-0000-4000-8000-000000000001',
              name: 'Timestamp Country',
              isoCode: 'ZZ',
              updatedAt: null
            }
          ],
          federations: [],
          regionalFederations: [],
          districts: [],
          associations: []
        }
      }
    )

    // After sync – countries has a timestamp
    const after = await timestampsHandler({}, sessionToken)
    expect(typeof (after as { countries: string | null }).countries).toBe('string')
  })
})
