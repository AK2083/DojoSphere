import { onMounted, onUnmounted, ref } from 'vue'

import { checkHeartbeatConnectivity } from '../service/check-heartbeat'

/**
 * Determines if browser globals are available.
 * @returns True when running in a browser-like environment.
 */
function isBrowserRuntime(): boolean {
  return typeof globalThis.window !== 'undefined' && typeof globalThis.navigator !== 'undefined'
}

/**
 * Reads browser online state in a runtime-safe way.
 * @returns Online state if available, otherwise false.
 */
function getNavigatorOnline(): boolean {
  if (!isBrowserRuntime()) {
    return false
  }

  return globalThis.navigator.onLine
}

/**
 * Runtime network status for UI components.
 *
 * Strategy:
 * - At app start, read `navigator.onLine`.
 * - If browser is online, validate backend connectivity via heartbeat.
 * - Keep status in sync via browser `online` / `offline` events.
 * - Expose a manual recheck for selected failed user actions.
 * @returns Reactive online/cloud flags and a manual connectivity recheck function.
 */
export function useNetworkStatus() {
  const isOnline = ref(false)
  const isCloudUsed = ref(false)

  async function runHeartbeatCheck(): Promise<boolean> {
    if (!getNavigatorOnline()) {
      isOnline.value = false
      isCloudUsed.value = false
      return false
    }

    const result = await checkHeartbeatConnectivity()
    const isReachable = result.success

    isOnline.value = isReachable
    isCloudUsed.value = isReachable

    return isReachable
  }

  /**
   * Trigger for selected flows after a failed user action.
   * No background polling is performed.
   * @returns True when backend heartbeat succeeds, otherwise false.
   */
  async function recheckAfterFailedUserAction(): Promise<boolean> {
    return await runHeartbeatCheck()
  }

  const onBrowserOnline = () => {
    void runHeartbeatCheck()
  }

  const onBrowserOffline = () => {
    isOnline.value = false
    isCloudUsed.value = false
  }

  onMounted(async () => {
    isOnline.value = getNavigatorOnline()
    isCloudUsed.value = false

    if (getNavigatorOnline()) {
      await runHeartbeatCheck()
    }

    if (!isBrowserRuntime()) {
      return
    }

    globalThis.window.addEventListener('online', onBrowserOnline)
    globalThis.window.addEventListener('offline', onBrowserOffline)
  })

  onUnmounted(() => {
    if (!isBrowserRuntime()) {
      return
    }

    globalThis.window.removeEventListener('online', onBrowserOnline)
    globalThis.window.removeEventListener('offline', onBrowserOffline)
  })

  return {
    isOnline,
    isCloudUsed,
    recheckAfterFailedUserAction
  }
}
