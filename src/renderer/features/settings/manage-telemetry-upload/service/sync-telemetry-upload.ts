import type { DiagnosticsUploadPreferences } from '@shared/types/electron-api'

/**
 * Syncs diagnostic upload preferences to the trusted main process.
 *
 * @param preferences Upload preferences from renderer settings.
 */
export async function syncTelemetryUploadPreferencesToMain(
  preferences: DiagnosticsUploadPreferences
): Promise<void> {
  if (!globalThis.window.api?.setDiagnosticsUploadPreferences) {
    return
  }

  await globalThis.window.api.setDiagnosticsUploadPreferences(preferences)
}
