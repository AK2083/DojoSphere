import { initDatabase, runMigrations } from '@main/shared/database'
import { registerIpcHandlers } from './register-ipc'

export function bootstrap() {
  const db = initDatabase()
  runMigrations(db)

  registerIpcHandlers()

  return {
    db
  }
}
