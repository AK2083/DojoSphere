import { app } from 'electron'

import { resolveDevServerUrl } from '../../config/dev'
import { bootstrap } from './app/bootstrap'
import { initLogging } from './app/init-logging'
import { createWindow } from './window/main-window'
import { createLogger, logError, toError } from '@main/shared/logging'

const mainLogger = createLogger('main')

const DEV_SERVER_URL = resolveDevServerUrl()

app.whenReady().then(() => {
  try {
    initLogging()
    bootstrap()
    createWindow(DEV_SERVER_URL)
  } catch (error) {
    const startupError = toError(error)
    logError(startupError, 'main', 'startup')
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
