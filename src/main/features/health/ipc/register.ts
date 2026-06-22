import { ipcMain } from 'electron'

import { runDatabaseHealthcheck } from '../service/db-healthcheck'

/**
 * Registers IPC handlers for database health checks.
 */
export function registerHealthIpc() {
  ipcMain.handle('db:healthcheck', () => {
    return runDatabaseHealthcheck()
  })
}
