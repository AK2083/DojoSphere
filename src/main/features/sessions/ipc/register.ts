import { ipcMain } from 'electron'

import { getActiveSessionByToken, revokeSessionByToken } from '../repository/sessions.repository'

/**
 * Registers IPC handlers for local session lifecycle.
 */
export function registerSessionsIpc() {
  ipcMain.handle('sessions:get', (_event, token: string) => {
    return getActiveSessionByToken(token)
  })

  ipcMain.handle('sessions:revoke', async (_event, token: string) => {
    const session = getActiveSessionByToken(token)

    revokeSessionByToken(token)

    if (session) {
      const { recordSessionRevoked } = await import('@main/features/audit')
      recordSessionRevoked(session)
    }
  })
}
