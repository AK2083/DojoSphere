import { ipcMain } from 'electron'

import { userHasPermission } from '@main/features/authorization'
import { getActiveSessionByToken } from '@main/features/sessions'
import { requireActiveSession, requirePermission } from '@main/shared/security'

const PARTICIPANTS_OVERVIEW_RESOURCE = 'participants-overview'

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
}
