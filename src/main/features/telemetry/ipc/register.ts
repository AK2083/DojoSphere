import { ipcMain } from 'electron'

import { checkGrafanaCloudReachability } from '../service/grafana-reachability'
import {
  setTelemetryUploadPreferences,
  type TelemetryUploadPreferences
} from '../service/upload-preferences'
import { uploadTracesOnError } from '../service/trace-upload'

/**
 * Registers IPC handlers for telemetry connectivity checks and upload.
 */
export function registerTelemetryIpc() {
  ipcMain.handle('telemetry:checkGrafanaReachability', () => {
    return checkGrafanaCloudReachability()
  })

  ipcMain.handle(
    'telemetry:setUploadPreferences',
    (_event, preferences: TelemetryUploadPreferences) => {
      setTelemetryUploadPreferences(preferences)
    }
  )

  ipcMain.handle('telemetry:uploadOnError', () => {
    return uploadTracesOnError()
  })
}
