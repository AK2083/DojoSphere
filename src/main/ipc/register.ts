import { registerHealthIpc } from './health'
import { registerUsersIpc } from './users'

export function registerIpcHandlers() {
  registerHealthIpc()
  registerUsersIpc()
}
