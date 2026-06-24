import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { useCloudStatusStore } from '../store'

/**
 * Enables or disables cloud mode and persists the preference.
 *
 * @param enabled Whether cloud services should be used.
 */
export function setCloudMode(enabled: boolean): void {
  const store = useCloudStatusStore()

  if (store.isCloudUsed === enabled) {
    return
  }

  store.setCloudUsed(enabled)
  monitorInformation(MONITORING_EVENTS.TOGGLE_CHANGED, { enabled })
}
