import { registerHealthIpc } from '@main/features/health'
import { registerSessionsIpc } from '@main/features/sessions'
import { registerSystemIpc } from '@main/features/system'
import { registerTelemetryIpc } from '@main/features/telemetry'
import { registerUsersIpc } from '@main/features/users'

/**
 * Registers all IPC handlers exposed to the preload bridge.
 */
export function registerIpcHandlers() {
  registerHealthIpc()
  registerSystemIpc()
  registerUsersIpc()
  registerSessionsIpc()
  registerTelemetryIpc()
}
