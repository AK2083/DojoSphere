import { registerHealthIpc } from '@main/features/health'
import { registerSessionsIpc } from '@main/features/sessions'
import { registerSystemIpc } from '@main/features/system'
import { registerUsersIpc } from '@main/features/users'

/**
 * Registers all IPC handlers exposed to the preload bridge.
 */
export function registerIpcHandlers() {
  registerHealthIpc()
  registerSystemIpc()
  registerUsersIpc()
  registerSessionsIpc()
}
