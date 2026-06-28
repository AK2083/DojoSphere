/** Cloud diagnostic upload preferences stored in the main process (no-op until a provider exists). */
export type DiagnosticsUploadPreferences = {
  autoUploadDiagnostics: boolean
}

let preferences: DiagnosticsUploadPreferences = {
  autoUploadDiagnostics: false
}

/**
 * Persists diagnostic upload preferences for a future cloud provider.
 *
 * @param next Preferences from renderer settings.
 */
export function setDiagnosticsUploadPreferences(next: DiagnosticsUploadPreferences): void {
  preferences = {
    autoUploadDiagnostics: Boolean(next.autoUploadDiagnostics)
  }
}

/**
 * Returns the current diagnostic upload preferences.
 *
 * @returns Stored preferences.
 */
export function getDiagnosticsUploadPreferences(): DiagnosticsUploadPreferences {
  return preferences
}

/**
 * Resets preferences (for tests).
 */
export function resetDiagnosticsUploadPreferencesForTests(): void {
  preferences = { autoUploadDiagnostics: false }
}
