/** In-memory telemetry upload preferences synced from the renderer. */
export type TelemetryUploadPreferences = {
  autoUploadDiagnostics: boolean
}

let preferences: TelemetryUploadPreferences = {
  autoUploadDiagnostics: false
}

/**
 * Updates telemetry upload preferences from the renderer settings.
 *
 * @param next Preferences to apply in the main process.
 */
export function setTelemetryUploadPreferences(next: TelemetryUploadPreferences): void {
  preferences = { ...next }
}

/**
 * Returns the current telemetry upload preferences.
 *
 * @returns Active upload preferences.
 */
export function getTelemetryUploadPreferences(): TelemetryUploadPreferences {
  return preferences
}

/**
 * Resets upload preferences (for tests).
 */
export function resetTelemetryUploadPreferences(): void {
  preferences = { autoUploadDiagnostics: false }
}
