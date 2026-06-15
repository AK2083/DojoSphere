import { getStorageItem, setStorageItem } from '@shared/lib'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

/**
 * Reads cloud mode from local storage.
 * @returns Stored cloud mode or null when no value is stored.
 */
export function getCloudStatusFromStorage(): boolean | null {
  const value = getStorageItem<boolean>(CLOUD_STATUS_KEY)
  monitorInformation(MONITORING_EVENTS.STORAGE_READ, { value })

  return value
}

/**
 * Persists cloud mode to local storage.
 * @param isCloudUsed Whether cloud mode is enabled.
 */
export function setCloudStatusToStorage(isCloudUsed: boolean) {
  monitorInformation(MONITORING_EVENTS.STORAGE_WRITE, { isCloudUsed })
  setStorageItem(CLOUD_STATUS_KEY, isCloudUsed)
}
