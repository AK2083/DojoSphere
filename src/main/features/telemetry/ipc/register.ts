import { ipcMain } from 'electron'

import { checkGrafanaCloudReachability } from '../service/grafana-reachability'

/**
 * Registers IPC handlers for telemetry connectivity checks.
 */
export function registerTelemetryIpc() {
  ipcMain.handle('telemetry:checkGrafanaReachability', () => {
    return checkGrafanaCloudReachability()
  })
}
