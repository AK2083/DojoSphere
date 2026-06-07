import { ipcMain } from 'electron'
import { addUser, getUsers } from '../modules/users.repository'

export function registerUsersIpc() {
  ipcMain.handle('users:list', () => {
    return getUsers()
  })

  ipcMain.handle('users:add', (_event, user: { name: string; data: unknown }) => {
    return addUser(user)
  })
}
