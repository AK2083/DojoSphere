import os from 'node:os'

import { ipcMain } from 'electron'

/**
 * Registers IPC handlers for host system information.
 */
export function registerSystemIpc() {
  ipcMain.handle('system:osUsername', () => {
    return os.userInfo().username
  })
}
