import type { TelemetryUploadPreferences } from '@shared/types/electron-api'

/**
 * Syncs telemetry upload preferences to the trusted main process.
 *
 * @param preferences Upload preferences from renderer settings.
 */
export async function syncTelemetryUploadPreferencesToMain(
  preferences: TelemetryUploadPreferences
): Promise<void> {
  if (!globalThis.window.api?.setTelemetryUploadPreferences) {
    return
  }

  await globalThis.window.api.setTelemetryUploadPreferences(preferences)
}

/**
 * Requests a main-process upload of pending exception traces after a renderer error.
 */
export async function requestTelemetryUploadOnError(): Promise<void> {
  if (!globalThis.window.api?.uploadTelemetryOnError) {
    return
  }

  await globalThis.window.api.uploadTelemetryOnError()
}
