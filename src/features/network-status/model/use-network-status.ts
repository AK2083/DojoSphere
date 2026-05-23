import { recheckNetworkStatusAfterFailedUserAction, useNetworkStatusState } from '@shared/model'

/**
 * UI adapter for network status state.
 * Business logic and side effects live in shared model.
 * @returns Reactive online/cloud flags and a manual connectivity recheck function.
 */
export function useNetworkStatus() {
  const { isOnline, isCloudUsed } = useNetworkStatusState()

  /**
   * Trigger for selected flows after a failed user action.
   * No background polling is performed.
   * @returns True when backend heartbeat succeeds, otherwise false.
   */
  async function recheckAfterFailedUserAction(): Promise<boolean> {
    return await recheckNetworkStatusAfterFailedUserAction()
  }

  return {
    isOnline,
    isCloudUsed,
    recheckAfterFailedUserAction
  }
}
