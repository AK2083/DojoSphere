import { newStore } from '@shared/lib/pinia/store-define'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { getCloudStatusFromStorage, setCloudStatusToStorage } from '../service/cloud-status-storage'

const DEFAULT_CLOUD_STATUS = true

export const useCloudStatusStore = newStore('cloud-status', {
  state: () => ({
    isCloudUsed: getCloudStatusFromStorage() ?? DEFAULT_CLOUD_STATUS
  }),
  actions: {
    setCloudUsed(value: boolean) {
      this.isCloudUsed = value
      setCloudStatusToStorage(value)
    },
    toggleCloudUsed() {
      const nextValue = !this.isCloudUsed
      monitorInformation(MONITORING_EVENTS.TOGGLED, { isCloudUsed: nextValue })
      this.setCloudUsed(nextValue)
    }
  }
})
