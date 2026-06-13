import { registerHealthIpc } from './health'
import { registerSessionsIpc } from './sessions'
import { registerSystemIpc } from './system'
import { registerUsersIpc } from './users'

export function registerIpcHandlers() {
  registerHealthIpc()
  registerSystemIpc()
  registerUsersIpc()
  registerSessionsIpc()
}
