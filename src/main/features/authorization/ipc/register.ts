import { ipcMain } from 'electron'

import { getActiveSessionByToken } from '@main/features/sessions'

import { userHasPermission } from '../repository/permissions.repository'

type HasPermissionIpcInput = {
  token: string
  resource: string
  action: string
}

/**
 * Registers IPC handlers for authorization checks exposed to the renderer.
 */
export function registerAuthorizationIpc() {
  ipcMain.handle('authorization:hasPermission', (_event, input: HasPermissionIpcInput) => {
    const session = getActiveSessionByToken(input.token)

    if (!session) {
      return false
    }

    return userHasPermission(session.userId, input.resource, input.action)
  })
}
