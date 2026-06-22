import { getStorageItem, setStorageItem } from '@shared/lib'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

/**
 * Reads whether cloud mode is enabled from browser storage.
 *
 * @returns Stored cloud mode flag, or null when unset.
 */
export function getCloudStatusFromStorage() {
  return getStorageItem<boolean>(CLOUD_STATUS_KEY)
}

/**
 * Persists whether cloud mode is enabled.
 *
 * @param isCloudUsed Whether cloud mode is enabled.
 */
export function setCloudStatusToStorage(isCloudUsed: boolean) {
  setStorageItem(CLOUD_STATUS_KEY, isCloudUsed)
}
