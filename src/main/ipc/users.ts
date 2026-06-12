import { ipcMain } from 'electron'
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
      return addUser(user)
    }
  )
}
