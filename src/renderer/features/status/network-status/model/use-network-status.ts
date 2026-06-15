import { useStatusState } from '../../model/use-status-state'
import { recheckNetworkStatusAfterFailedUserAction } from '../../service/bootstrap-network-status'

/**
 * UI adapter for network status state.
 * @returns Reactive online/cloud flags and a manual connectivity recheck function.
 */
export function useNetworkStatus() {
  const { isOnline, isCloudUsed } = useStatusState()

  /**
   * Trigger for selected flows after a failed user action.
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
