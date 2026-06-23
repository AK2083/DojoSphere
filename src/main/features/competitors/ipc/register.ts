import { ipcMain } from 'electron'

import { getActiveSessionByToken } from '@main/features/sessions'
import { requireActiveSession } from '@main/shared/security'

import {
  addCompetitor,
  deleteCompetitor,
  getCompetitors,
  updateCompetitor
} from '../repository/competitors.repository'

/**
 * Registers IPC handlers for competitor lifecycle management.
 */
export function registerCompetitorsIpc() {
  ipcMain.handle('competitors:list', (_event, token: string) => {
    requireActiveSession(token, getActiveSessionByToken)

    return getCompetitors()
  })

  ipcMain.handle(
    'competitors:add',
    (
      _event,
      input: {
        token: string
        givenName: string
        familyName: string
        club?: string | null
        weightClass?: string | null
      }
    ) => {
      const session = requireActiveSession(input.token, getActiveSessionByToken)

      return addCompetitor(session.userId, {
        givenName: input.givenName,
        familyName: input.familyName,
        club: input.club,
        weightClass: input.weightClass
      })
    }
  )

  ipcMain.handle(
    'competitors:update',
    (
      _event,
      input: {
        token: string
        id: string
        givenName?: string
        familyName?: string
        club?: string | null
        weightClass?: string | null
      }
    ) => {
      const session = requireActiveSession(input.token, getActiveSessionByToken)

      return updateCompetitor(session.userId, input.id, {
        givenName: input.givenName,
        familyName: input.familyName,
        club: input.club,
        weightClass: input.weightClass
      })
    }
  )

  ipcMain.handle('competitors:delete', (_event, input: { token: string; id: string }) => {
    const session = requireActiveSession(input.token, getActiveSessionByToken)

    deleteCompetitor(session.userId, input.id)
  })
}
