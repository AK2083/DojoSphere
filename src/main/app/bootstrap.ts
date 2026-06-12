import { initDatabase } from '../database/connection'
import { runMigrations } from '../database/migrate'
import { registerIpcHandlers } from '../ipc/register'

export function bootstrap() {
  const db = initDatabase()
  runMigrations(db)

  registerIpcHandlers()

  return {
    db
  }
}
