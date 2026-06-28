import { ipcMain } from 'electron'

import {
  setDiagnosticsUploadPreferences,
  type DiagnosticsUploadPreferences
} from '../service/upload-preferences'

/**
 * Registers IPC handlers for diagnostic settings (upload is a no-op until configured).
 */
export function registerDiagnosticsIpc() {
  ipcMain.handle(
    'diagnostics:setUploadPreferences',
    (_event, next: DiagnosticsUploadPreferences) => {
      setDiagnosticsUploadPreferences(next)
    }
  )
}
