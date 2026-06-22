import { initDatabase, runMigrations } from '@main/shared/database'
import { createLogger } from '@main/shared/logging'

import { registerIpcHandlers } from './register-ipc'

const bootstrapLogger = createLogger('bootstrap')

/**
 * Initializes the main process: database, migrations, and IPC handlers.
 *
 * @returns Bootstrap result including the database connection.
 */
export function bootstrap() {
  bootstrapLogger.info('Starting main process bootstrap')

  const db = initDatabase()
  runMigrations(db)
  bootstrapLogger.info('Database initialized and migrations applied')

  registerIpcHandlers()
  bootstrapLogger.info('IPC handlers registered')

  return {
    db
  }
}
