import { app } from 'electron'

import { resolveDevServerUrl } from '../../config/dev'
import { bootstrap } from './app/bootstrap'
import { initTelemetryApp } from './app/init-telemetry'
import { createWindow } from './window/main-window'
import { createLogger } from '@main/shared/logging'
import { captureException } from '@main/shared/telemetry'

const mainLogger = createLogger('main')

const DEV_SERVER_URL = resolveDevServerUrl()

app.whenReady().then(async () => {
  try {
    await initTelemetryApp(import.meta.env.MODE ?? 'production')
    bootstrap()
    createWindow(DEV_SERVER_URL)
  } catch (error) {
    const startupError = error instanceof Error ? error : new Error(String(error))
    captureException(startupError, 'main', 'startup')
    mainLogger.error('Application startup failed', {
      reason: startupError.message
    })
    app.quit()
    process.exit(1)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
