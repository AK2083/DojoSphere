import { app } from 'electron'

import { initTelemetry, shutdownTelemetry } from '@main/features/telemetry'

let shutdownRegistered = false

/**
 * Initializes local OpenTelemetry capture in the main process.
 *
 * @param environment Application environment label (e.g. `development`, `production`).
 * @returns Resolves when the collector and main-process tracer are running.
 */
export async function initTelemetryApp(environment: string): Promise<void> {
  await initTelemetry({
    environment,
    userDataPath: app.getPath('userData')
  })

  if (!shutdownRegistered) {
    shutdownRegistered = true
    app.on('before-quit', () => {
      void shutdownTelemetry()
    })
  }
}
