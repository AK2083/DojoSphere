// src/main/ipc/health.ipc.ts
import { ipcMain } from 'electron'

import { getDatabase } from '../database/connection'

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
