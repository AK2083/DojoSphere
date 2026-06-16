import os from 'node:os'

import { ipcMain } from 'electron'

export function registerSystemIpc() {
  ipcMain.handle('system:osUsername', () => {
    return os.userInfo().username
  })
}
