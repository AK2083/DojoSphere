import { ipcMain } from 'electron'

import { logError } from '@main/shared/logging'

/** Renderer error payload forwarded over IPC. */
export type RecordErrorInput = {
  service: string
  action: string
  code?: string
  message: string
}

/**
 * Registers IPC handlers for renderer error logging.
 */
export function registerLoggingIpc() {
  ipcMain.handle('logging:recordError', (_event, input: RecordErrorInput) => {
    const error = new Error(input.message)

    if (input.code) {
      Object.assign(error, { code: input.code })
    }

    logError(error, input.service, input.action)
  })
}
