import { app } from 'electron'

import { resolveDevServerUrl } from '../../config/dev'
import { bootstrap } from './app/bootstrap'
import { initTelemetryApp } from './app/init-telemetry'
import { createWindow } from './window/main-window'
import { createLogger } from '@main/shared/logging'

const mainLogger = createLogger('main')

const DEV_SERVER_URL = resolveDevServerUrl()

app.whenReady().then(async () => {
  try {
    await initTelemetryApp(import.meta.env.MODE ?? 'production')
    bootstrap()
    createWindow(DEV_SERVER_URL)
  } catch (error) {
    mainLogger.error('Application startup failed', {
      reason: error instanceof Error ? error.message : 'unknown'
    })
    app.quit()
    process.exit(1)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
