import { ipcMain } from 'electron'

import { createSession } from '../modules/sessions.repository'
import { addUser, getUsers } from '../modules/users.repository'

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
}
