import { ipcMain } from 'electron'

import { getActiveSessionByToken, revokeSessionByToken } from '../modules/sessions.repository'

export function registerSessionsIpc() {
  ipcMain.handle('sessions:get', (_event, token: string) => {
    return getActiveSessionByToken(token)
  })

  ipcMain.handle('sessions:revoke', (_event, token: string) => {
    revokeSessionByToken(token)
  })
}
