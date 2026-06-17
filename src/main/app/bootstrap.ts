import { initDatabase, runMigrations } from '@main/shared/database'

import { registerIpcHandlers } from './register-ipc'

/**
 * Initializes the main process: database, migrations, and IPC handlers.
 *
 * @returns Bootstrap result including the database connection.
 */
export function bootstrap() {
  const db = initDatabase()
  runMigrations(db)

  registerIpcHandlers()

  return {
    db
  }
}
