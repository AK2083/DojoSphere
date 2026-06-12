import { registerHealthIpc } from './health'
import { registerSystemIpc } from './system'
import { registerUsersIpc } from './users'

export function registerIpcHandlers() {
  registerHealthIpc()
  registerSystemIpc()
  registerUsersIpc()
}
