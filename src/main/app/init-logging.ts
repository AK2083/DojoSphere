import { app } from 'electron'

import { initLogger } from '@main/shared/logging'
import { registerProcessErrorHandlers } from '@main/shared/logging/register-process-error-handlers'

/**
 * Initializes local error logging in the main process.
 */
export function initLogging(): void {
  initLogger(app.getPath('userData'))
  registerProcessErrorHandlers()
}
