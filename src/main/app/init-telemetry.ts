import { app } from 'electron'

import { initTelemetry, shutdownTelemetry } from '@main/features/telemetry'
import { createLogger, initLogger } from '@main/shared/logging'

let shutdownRegistered = false
const telemetryAppLogger = createLogger('telemetry:app')

/**
 * Initializes local OpenTelemetry capture in the main process.
 *
 * @param environment Application environment label (e.g. `development`, `production`).
 * @returns Resolves when the collector and main-process tracer are running.
 */
export async function initTelemetryApp(environment: string): Promise<void> {
  initLogger(app.getPath('userData'))
  telemetryAppLogger.info('Initializing local telemetry capture', { environment })

  await initTelemetry({
    environment,
    userDataPath: app.getPath('userData')
  })

  telemetryAppLogger.info('Local telemetry capture ready')

  if (!shutdownRegistered) {
    shutdownRegistered = true
    app.on('before-quit', () => {
      telemetryAppLogger.debug('Application before-quit: shutting down telemetry')
      void shutdownTelemetry()
    })
  }
}
