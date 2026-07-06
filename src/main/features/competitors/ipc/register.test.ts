import type {
  AddUserResult,
  Competitor,
  ImportExecuteResult,
  ImportPreviewResult
} from '@shared/types/electron-api'
import * as XLSX from 'xlsx'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

function buildWorkbook(rows: unknown[][]): ArrayBuffer {
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Teilnehmer')

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

describe('registerCompetitorsIpc', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
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

  it('does not send import progress when the renderer was destroyed', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')

    registerUsersIpc()
    registerCompetitorsIpc()

    const executeHandler = getIpcHandler('competitors:import:execute')
    const { sessionToken } = await createLocalUserWithSession()
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Verein'],
      ['Yuki', 'Tanaka', 'Dojo Nord']
    ])
    const previewHandler = getIpcHandler('competitors:import:preview')
    const preview = (await previewHandler(
      {},
      { token: sessionToken, buffer }
    )) as ImportPreviewResult
    const send = vi.fn()

    await executeHandler(
      {
        sender: {
          isDestroyed: () => true,
          send
        }
      },
      {
        token: sessionToken,
        buffer,
        mapping: preview.suggestedMapping
      }
    )

    expect(send).not.toHaveBeenCalled()
  })

  it('previews and executes imports through IPC handlers', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')
    const { getCompetitors } = await import('../repository/competitors.repository')

    registerUsersIpc()
    registerCompetitorsIpc()

    const previewHandler = getIpcHandler('competitors:import:preview')
    const executeHandler = getIpcHandler('competitors:import:execute')
    const { sessionToken, id: actorUserId } = await createLocalUserWithSession()
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname', 'Verein'],
      ['Yuki', 'Tanaka', 'Dojo Nord']
    ])

    const preview = (await previewHandler(
      {},
      {
        token: sessionToken,
        buffer
      }
    )) as ImportPreviewResult

    expect(preview.mappingValid).toBe(true)

    const send = vi.fn()
    const result = (await executeHandler(
      {
        sender: {
          isDestroyed: () => false,
          send
        }
      },
      {
        token: sessionToken,
        buffer,
        mapping: preview.suggestedMapping
      }
    )) as ImportExecuteResult

    expect(result.importedCount).toBe(1)
    expect(getCompetitors()).toHaveLength(1)
    expect(send).toHaveBeenCalledWith('competitors:import:progress', {
      processed: 1,
      total: 1
    })
    void actorUserId
  })

  it('wraps import preview failures as structured ipc errors', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')
    const importService = await import('../import/import-service')

    registerUsersIpc()
    registerCompetitorsIpc()

    vi.spyOn(importService, 'previewImport').mockImplementation(() => {
      throw new Error('invalid file')
    })

    const previewHandler = getIpcHandler('competitors:import:preview')
    const { sessionToken } = await createLocalUserWithSession()

    expect(() =>
      previewHandler(
        {},
        {
          token: sessionToken,
          buffer: new ArrayBuffer(8)
        }
      )
    ).toThrow(/^IMPORT:parse_failed\|/)
  })

  it('wraps import execute failures as structured ipc errors', async () => {
    await initTestDatabase()
    const { registerUsersIpc } = await import('@main/features/users')
    const { registerCompetitorsIpc } = await import('./register')

    registerUsersIpc()
    registerCompetitorsIpc()

    const executeHandler = getIpcHandler('competitors:import:execute')
    const { sessionToken } = await createLocalUserWithSession()
    const buffer = buildWorkbook([
      ['Vorname', 'Nachname'],
      ['', '']
    ])

    expect(() =>
      executeHandler(
        {
          sender: {
            isDestroyed: () => false,
            send: vi.fn()
          }
        },
        {
          token: sessionToken,
          buffer,
          mapping: {
            givenName: 'Teilnehmer#0',
            familyName: 'Teilnehmer#1'
          }
        }
      )
    ).toThrow(/^IMPORT:empty_workbook\|/)
  })
})
