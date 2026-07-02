import type { AddUserResult, Competitor } from '@shared/types/electron-api'
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

describe('registerCompetitorsIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('adds a competitor through competitors:add and records audit with actor_user_id (director or scorekeeper)', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerCompetitorsIpc()

    const addHandler = getIpcHandler('competitors:add')
    const { sessionToken, id: actorUserId } = await createLocalUserWithSession()

    const competitor = (await addHandler(
      {},
      {
        token: sessionToken,
        givenName: 'Yuki',
        familyName: 'Tanaka',
        club: 'Tokyo Dojo',
        weightClass: '-60'
      }
    )) as Competitor

    expect(competitor).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'created'
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
      entityType: 'competitor',
      entityId: competitor.id,
      actorUserId
    })
  })

  it('lists competitors through competitors:list', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')

    registerUsersIpc()
    registerCompetitorsIpc()

    const addHandler = getIpcHandler('competitors:add')
    const listHandler = getIpcHandler('competitors:list')
    const { sessionToken } = await createLocalUserWithSession()

    await addHandler(
      {},
      {
        token: sessionToken,
        givenName: 'Yuki',
        familyName: 'Tanaka'
      }
    )

    const competitors = await listHandler({}, sessionToken)

    expect(competitors).toEqual([
      expect.objectContaining({
        givenName: 'Yuki',
        familyName: 'Tanaka'
      })
    ])
  })

  it('returns a competitor through competitors:get', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')

    registerUsersIpc()
    registerCompetitorsIpc()

    const addHandler = getIpcHandler('competitors:add')
    const getHandler = getIpcHandler('competitors:get')
    const { sessionToken } = await createLocalUserWithSession()

    const competitor = (await addHandler(
      {},
      {
        token: sessionToken,
        givenName: 'Yuki',
        familyName: 'Tanaka'
      }
    )) as Competitor

    const loaded = (await getHandler(
      {},
      {
        token: sessionToken,
        id: competitor.id
      }
    )) as Competitor

    expect(loaded).toMatchObject({
      id: competitor.id,
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })
  })

  it('throws when competitors:get is called for an unknown id', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')

    registerUsersIpc()
    registerCompetitorsIpc()

    const getHandler = getIpcHandler('competitors:get')
    const { sessionToken } = await createLocalUserWithSession()

    expect(() =>
      getHandler(
        {},
        {
          token: sessionToken,
          id: 'missing-competitor-id'
        }
      )
    ).toThrow('Competitor not found')
  })

  it('rejects competitor operations without a valid session', async () => {
    await initTestDatabase()
    const { registerCompetitorsIpc } = await import('./register')

    registerCompetitorsIpc()

    const addHandler = getIpcHandler('competitors:add')

    expect(() =>
      addHandler(
        {},
        {
          token: 'invalid-token',
          givenName: 'Yuki',
          familyName: 'Tanaka'
        }
      )
    ).toThrow('Unauthorized')
  })

  it('rejects competitor operations without participants-overview permission', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')
    const { createSession } = await import('@main/features/sessions')

    registerUsersIpc()
    registerCompetitorsIpc()

    const addHandler = getIpcHandler('users:add')
    const listHandler = getIpcHandler('competitors:list')
    const { id: userId } = (await addHandler(
      {},
      {
        displayName: 'Device User',
        userType: 'device'
      }
    )) as AddUserResult
    const { token: sessionToken } = createSession(userId)

    expect(() => listHandler({}, sessionToken)).toThrow('Forbidden')
  })

  it('updates and deletes competitors through IPC', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')
    const { getDatabase } = await import('@main/shared/database')

    registerUsersIpc()
    registerCompetitorsIpc()

    const addHandler = getIpcHandler('competitors:add')
    const updateHandler = getIpcHandler('competitors:update')
    const deleteHandler = getIpcHandler('competitors:delete')
    const listHandler = getIpcHandler('competitors:list')
    const { sessionToken } = await createLocalUserWithSession()

    const competitor = (await addHandler(
      {},
      {
        token: sessionToken,
        givenName: 'Yuki',
        familyName: 'Tanaka',
        club: 'Tokyo Dojo'
      }
    )) as Competitor

    const updated = await updateHandler(
      {},
      {
        token: sessionToken,
        id: competitor.id,
        club: 'Osaka Dojo'
      }
    )

    expect(updated).toMatchObject({
      club: 'Osaka Dojo'
    })

    await deleteHandler(
      {},
      {
        token: sessionToken,
        id: competitor.id
      }
    )

    expect(await listHandler({}, sessionToken)).toEqual([])

    const auditActions = getDatabase()
      .prepare(
        `
        SELECT action
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND entity_id = ?
        ORDER BY created_at ASC
      `
      )
      .all(competitor.id) as Array<{ action: string }>

    expect(auditActions.map((row) => row.action)).toEqual(['created', 'updated', 'deleted'])
  })
})
