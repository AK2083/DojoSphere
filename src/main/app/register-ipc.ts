import { registerHealthIpc } from '@main/features/health'
import { registerSessionsIpc } from '@main/features/sessions'
import { registerSystemIpc } from '@main/features/system'
import { registerUsersIpc } from '@main/features/users'

export function registerIpcHandlers() {
  registerHealthIpc()
  registerSystemIpc()
  registerUsersIpc()
  registerSessionsIpc()
}
