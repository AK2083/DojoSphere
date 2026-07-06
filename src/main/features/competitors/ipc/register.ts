import { ipcMain } from 'electron'

import { userHasPermission } from '@main/features/authorization'
import { getActiveSessionByToken } from '@main/features/sessions'
import { logError } from '@main/shared/logging'
import { requireActiveSession, requirePermission } from '@main/shared/security'
import { toImportIpcError } from '@shared/domain/competitor-import-errors'

const PARTICIPANTS_OVERVIEW_RESOURCE = 'participants-overview'

import { executeImport, previewImport } from '../import/import-service'
import type { ColumnMapping } from '../import/match-columns'
import {
  addCompetitor,
  type CreateCompetitorInput,
  deleteCompetitor,
  getCompetitor,
  getCompetitors,
  type UpdateCompetitorInput,
  updateCompetitor
} from '../repository/competitors.repository'

type AddCompetitorIpcInput = CreateCompetitorInput & { token: string }
type UpdateCompetitorIpcInput = UpdateCompetitorInput & { token: string; id: string }
type ImportPreviewIpcInput = { token: string; buffer: ArrayBuffer }
type ImportExecuteIpcInput = {
  token: string
  buffer: ArrayBuffer
  mapping: Record<string, string>
}

/**
 * Registers IPC handlers for competitor lifecycle management.
 */
export function registerCompetitorsIpc() {
  ipcMain.handle('competitors:list', (_event, token: string) => {
    const session = requireActiveSession(token, getActiveSessionByToken)

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'read', userHasPermission)

    return getCompetitors()
  })

  ipcMain.handle('competitors:get', (_event, input: { token: string; id: string }) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'read', userHasPermission)

    const competitor = getCompetitor(input.id)

    if (!competitor) {
      throw new Error('Competitor not found')
    }

    return competitor
  })

  ipcMain.handle('competitors:add', (_event, input: AddCompetitorIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)
    const { token, ...competitor } = input

    void token

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'create', userHasPermission)

    return addCompetitor(session.userId, competitor)
  })

  ipcMain.handle('competitors:update', (_event, input: UpdateCompetitorIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)
    const { token, id, ...competitor } = input

    void token

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'update', userHasPermission)

    return updateCompetitor(session.userId, id, competitor)
  })

  ipcMain.handle('competitors:delete', (_event, input: { token: string; id: string }) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'delete', userHasPermission)

    deleteCompetitor(session.userId, input.id)
  })

  ipcMain.handle('competitors:import:preview', (_event, input: ImportPreviewIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'create', userHasPermission)

    try {
      return previewImport(input.buffer)
    } catch (error) {
      logError(error as Error, 'competitors', 'import-preview-ipc')
      throw toImportIpcError(error)
    }
  })

  ipcMain.handle('competitors:import:execute', (event, input: ImportExecuteIpcInput) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    requirePermission(session.userId, PARTICIPANTS_OVERVIEW_RESOURCE, 'create', userHasPermission)

    try {
      return executeImport(
        session.userId,
        input.buffer,
        input.mapping as ColumnMapping,
        (processed, total) => {
          if (!event.sender.isDestroyed()) {
            event.sender.send('competitors:import:progress', { processed, total })
          }
        }
      )
    } catch (error) {
      logError(error as Error, 'competitors', 'import-execute-ipc')
      throw toImportIpcError(error)
    }
  })
}
