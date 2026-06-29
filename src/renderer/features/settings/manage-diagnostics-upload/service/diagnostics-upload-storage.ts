import {
  getStorageItem,
  removeStorageItem,
  setStorageItem
} from '@shared/lib/browser/local-storage'

const DIAGNOSTICS_AUTO_UPLOAD_KEY = 'dojosphere.settings.diagnostics.autoUploadDiagnostics'
const LEGACY_AUTO_UPLOAD_KEY = 'dojosphere.settings.telemetry.autoUploadDiagnostics'

/**
 * Reads whether automatic diagnostic upload is enabled from local storage.
 *
 * Migrates the legacy telemetry storage key when present.
 *
 * @returns Stored preference or null when unset.
 */
export function getDiagnosticsAutoUploadFromStorage(): boolean | null {
  const current = getStorageItem<boolean>(DIAGNOSTICS_AUTO_UPLOAD_KEY)

  if (current !== null) {
    return current
  }

  const legacy = getStorageItem<boolean>(LEGACY_AUTO_UPLOAD_KEY)

  if (legacy === null) {
    return null
  }

  setStorageItem(DIAGNOSTICS_AUTO_UPLOAD_KEY, legacy)
  removeStorageItem(LEGACY_AUTO_UPLOAD_KEY)

  return legacy
}

/**
 * Persists the automatic diagnostic upload preference.
 *
 * @param enabled Whether diagnostics should upload on errors when a provider exists.
 */
export function setDiagnosticsAutoUploadToStorage(enabled: boolean): void {
  setStorageItem(DIAGNOSTICS_AUTO_UPLOAD_KEY, enabled)
  removeStorageItem(LEGACY_AUTO_UPLOAD_KEY)
}
