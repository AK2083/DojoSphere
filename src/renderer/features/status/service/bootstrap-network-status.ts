import { heartbeat } from '@shared/api'
import { AppError } from '@shared/errors'
import { getNavigatorOnline, isBrowserRuntime, logError } from '@shared/lib'
import { bindConnectivityState } from '@shared/model'

import { useStatusState } from '../model/use-status-state'
import { useNetworkStatusStore } from '../network-status/store'

/** Result of checking backend connectivity via the heartbeat edge function. */
export type HeartbeatCheckResult = { success: true } | { success: false; error: AppError }

function mapHeartbeatError(_error: Error): AppError {
  if (!getNavigatorOnline()) {
    return new AppError('shared.error.retry')
  }

  return new AppError('shared.error.unknown')
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
      logError(mappedError, 'network', 'checkHeartbeatConnectivity')
    }

    return {
      success: false,
      error: mappedError
    }
  }

  if (data?.status !== 'ok') {
    const payloadError = new AppError('shared.error.unknown', 'Invalid heartbeat response payload')
    logError(payloadError, 'network', 'checkHeartbeatConnectivity')

    return {
      success: false,
      error: payloadError
    }
  }

  return { success: true }
}

function setOfflineState() {
  const store = useNetworkStatusStore()
  store.setOnline(false)
  store.setSupabaseReachable(false)
}

async function runConnectivityChecks(): Promise<boolean> {
  if (!getNavigatorOnline()) {
    setOfflineState()
    return false
  }

  const isSupabaseReachable = (await checkHeartbeatConnectivity()).success
  const store = useNetworkStatusStore()
  store.setSupabaseReachable(isSupabaseReachable)
  store.setOnline(isSupabaseReachable)

  return isSupabaseReachable
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

  bindConnectivityState(useStatusState())
  useNetworkStatusStore().setOnline(getNavigatorOnline())

  if (getNavigatorOnline()) {
    await runConnectivityChecks()
  } else {
    setOfflineState()
  }

  if (!isBrowserRuntime()) {
    return
  }

  globalThis.window.addEventListener('online', () => {
    void runConnectivityChecks()
  })
  globalThis.window.addEventListener('offline', setOfflineState)
}

/**
 * Trigger for selected flows after a failed user action.
 * @returns True when backend heartbeat succeeds, otherwise false.
 */
export async function recheckNetworkStatusAfterFailedUserAction(): Promise<boolean> {
  return await runConnectivityChecks()
}
