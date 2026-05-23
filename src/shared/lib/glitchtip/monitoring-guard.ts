import { getActiveStore, getNavigatorOnline, useCloudStatusStore } from '@shared/lib'

/**
 * Indicates whether monitoring calls should currently be sent.
 * @returns True when monitoring calls are allowed.
 */
export function isMonitoringEnabled(): boolean {
  const hasInternet = getNavigatorOnline()
  const activeStore = getActiveStore()

  if (!activeStore) {
    return hasInternet
  }

  const cloudStatusStore = useCloudStatusStore(activeStore)

  return cloudStatusStore.isCloudUsed && hasInternet
}
