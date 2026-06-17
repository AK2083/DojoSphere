import { ipcMain } from 'electron'

import { getDatabase } from '@main/shared/database'

/**
 * Registers IPC handlers for database health checks.
 */
export function registerHealthIpc() {
  ipcMain.handle('db:healthcheck', () => {
    const db = getDatabase()

    const result = db.prepare('SELECT sqlite_version() AS version').get() as
      | { version: string }
      | undefined

    return {
      ok: true,
      version: result?.version ?? 'unknown'
    }
  })
}
