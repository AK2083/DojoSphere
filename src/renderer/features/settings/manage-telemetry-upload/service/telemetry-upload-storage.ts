import { getStorageItem, setStorageItem } from '@shared/lib/browser/local-storage'

const TELEMETRY_AUTO_UPLOAD_KEY = 'dojosphere.settings.telemetry.autoUploadDiagnostics'

/**
 * Reads whether automatic diagnostic upload is enabled from local storage.
 *
 * @returns Stored preference or null when unset.
 */
export function getTelemetryAutoUploadFromStorage(): boolean | null {
  return getStorageItem<boolean>(TELEMETRY_AUTO_UPLOAD_KEY)
}

/**
 * Persists the automatic diagnostic upload preference.
 *
 * @param enabled Whether diagnostics should upload on errors.
 */
export function setTelemetryAutoUploadToStorage(enabled: boolean): void {
  setStorageItem(TELEMETRY_AUTO_UPLOAD_KEY, enabled)
}
