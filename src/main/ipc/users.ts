import { ipcMain } from 'electron'

import { getActiveSessionByToken, createSession } from '../modules/sessions.repository'
import {
  addUser,
  ensureLocalUserSession,
  getUsers,
  updateUserDisplayName
} from '../modules/users.repository'

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
      const result = addUser(user)
      const userType = user.userType ?? 'local'

      if (userType !== 'local') {
        return result
      }

      const session = createSession(result.id)

      return {
        ...result,
        sessionToken: session.token,
        expiresAt: session.expiresAt
      }
    }
  )

  ipcMain.handle('users:ensureLocalSession', (_event, displayName: string) => {
    return ensureLocalUserSession(displayName)
  })

  ipcMain.handle(
    'users:updateDisplayName',
    (_event, { token, displayName }: { token: string; displayName: string }) => {
      const session = getActiveSessionByToken(token)

      if (!session) {
        throw new Error('Unauthorized')
      }

      return updateUserDisplayName(session.userId, displayName)
    }
  )
}
