import { initDatabase, runMigrations } from '@main/shared/database'
import { registerIpcHandlers } from '../ipc/register'

export function bootstrap() {
  const db = initDatabase()
  runMigrations(db)

  registerIpcHandlers()

  return {
    db
  }
}
