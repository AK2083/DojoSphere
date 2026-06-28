import { ipcMain } from 'electron'

import { recordSessionRevoked } from '@main/features/audit'
import { getActiveSessionByToken, revokeSessionByToken } from '../repository/sessions.repository'

/**
 * Registers IPC handlers for local session lifecycle.
 */
export function registerSessionsIpc() {
  ipcMain.handle('sessions:get', (_event, token: string) => {
    return getActiveSessionByToken(token)
  })

  ipcMain.handle('sessions:revoke', (_event, token: string) => {
    const session = getActiveSessionByToken(token)

    revokeSessionByToken(token)

    if (session) {
      recordSessionRevoked(session)
    }
  })
}
