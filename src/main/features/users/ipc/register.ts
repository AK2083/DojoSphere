import { ipcMain } from 'electron'

import { getActiveSessionByToken } from '@main/features/sessions'
import { requireActiveSession } from '@main/shared/security'

import { getUsers, updateUserDisplayName } from '../repository/users.repository'
import { addUserWithSession } from '../service/add-user-with-session'
import { ensureLocalUserSession } from '../service/ensure-local-user-session'

/**
 * Registers IPC handlers for local user management.
 */
export function registerUsersIpc() {
  ipcMain.handle('users:list', () => {
    return getUsers()
  })

  ipcMain.handle(
    'users:add',
    (
      _event,
      user: { displayName: string; email?: string | null; userType?: 'local' | 'device' | 'system' }
    ) => {
      return addUserWithSession(user)
    }
  )

  ipcMain.handle('users:ensureLocalSession', (_event, displayName: string) => {
    return ensureLocalUserSession(displayName)
  })

  ipcMain.handle(
    'users:updateDisplayName',
    (_event, { token, displayName }: { token: string; displayName: string }) => {
      const session = requireActiveSession(token, getActiveSessionByToken)

      return updateUserDisplayName(session.userId, displayName)
    }
  )
}
