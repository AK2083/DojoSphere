import { ipcMain } from 'electron'
import os from 'node:os'

export function registerSystemIpc() {
  ipcMain.handle('system:osUsername', () => {
    return os.userInfo().username
  })
}
