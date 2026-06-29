import { registerAuditIpc } from '@main/features/audit/ipc/register'
import { registerCompetitorsIpc } from '@main/features/competitors'
import { registerDiagnosticsIpc } from '@main/features/diagnostics'
import { registerHealthIpc } from '@main/features/health'
import { registerLoggingIpc } from '@main/features/logging'
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
  registerCompetitorsIpc()
  registerLoggingIpc()
  registerDiagnosticsIpc()
  registerAuditIpc()
}
