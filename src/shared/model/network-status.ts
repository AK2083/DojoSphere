import { ref } from 'vue'
import { heartbeat } from '@shared/api'
import { AppError } from '@shared/errors'
import {
  captureException,
  getActiveStore,
  getNavigatorOnline,
  isBrowserRuntime,
  newStoreToRefs
} from '@shared/lib'
import { useCloudStatusStore, useNetworkStatusStore } from '@shared/store/network'

export type HeartbeatCheckResult = { success: true } | { success: false; error: AppError }

function mapHeartbeatError(error: Error): AppError {
  if (!getNavigatorOnline()) {
    return new AppError('shared.error.retry')
  }

  return new AppError('shared.error.unknown', error.message)
}

/**
 * Checks backend reachability through the heartbeat edge function.
 * @returns Connectivity result with success state or mapped application error.
 */
export async function checkHeartbeatConnectivity(): Promise<HeartbeatCheckResult> {
  const { data, error } = await heartbeat()

  if (error) {
    const mappedError = mapHeartbeatError(error)

    if (mappedError.code !== 'shared.error.retry') {
      captureException(mappedError, 'network', 'checkHeartbeatConnectivity')
    }

    return {
      success: false,
      error: mappedError
    }
  }

  if (data?.status !== 'ok') {
    const payloadError = new AppError('shared.error.unknown', 'Invalid heartbeat response payload')
    captureException(payloadError, 'network', 'checkHeartbeatConnectivity')

    return {
      success: false,
      error: payloadError
    }
  }

  return { success: true }
}

function setOfflineState() {
  useNetworkStatusStore().setOnline(false)
  useCloudStatusStore().setCloudUsed(false)
}

async function runHeartbeatCheck(): Promise<boolean> {
  if (!getNavigatorOnline()) {
    setOfflineState()
    return false
  }

  const isReachable = (await checkHeartbeatConnectivity()).success
  useNetworkStatusStore().setOnline(isReachable)
  useCloudStatusStore().setCloudUsed(isReachable)

  return isReachable
}

let hasNetworkStatusBootstrap = false

/**
 * Initializes runtime network tracking once for the app lifecycle.
 */
export async function bootstrapNetworkStatus(): Promise<void> {
  if (hasNetworkStatusBootstrap) {
    return
  }

  hasNetworkStatusBootstrap = true

  useNetworkStatusStore().setOnline(getNavigatorOnline())
  useCloudStatusStore().setCloudUsed(false)

  if (getNavigatorOnline()) {
    await runHeartbeatCheck()
  }

  if (!isBrowserRuntime()) {
    return
  }

  globalThis.window.addEventListener('online', () => {
    void runHeartbeatCheck()
  })
  globalThis.window.addEventListener('offline', setOfflineState)
}

/**
 * Trigger for selected flows after a failed user action.
 * @returns True when backend heartbeat succeeds, otherwise false.
 */
export async function recheckNetworkStatusAfterFailedUserAction(): Promise<boolean> {
  return await runHeartbeatCheck()
}

/**
 * Exposes reactive network status state for UI bindings.
 * @returns Reactive online and cloud-usage refs.
 */
export function useNetworkStatusState() {
  const activeStore = getActiveStore()

  if (!activeStore) {
    return {
      isOnline: ref(getNavigatorOnline()),
      isCloudUsed: ref(false)
    }
  }

  const { isOnline } = newStoreToRefs(useNetworkStatusStore(activeStore))
  const { isCloudUsed } = newStoreToRefs(useCloudStatusStore(activeStore))

  return { isOnline, isCloudUsed }
}
