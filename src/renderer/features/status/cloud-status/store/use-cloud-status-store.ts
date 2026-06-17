import { newStore } from '@shared/lib/pinia/store-define'

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
    }
  }
})
