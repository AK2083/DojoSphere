import { newStore } from '@shared/lib'

export const useCloudStatusStore = newStore('cloud-status', {
  state: () => ({
    isCloudUsed: true
  }),
  actions: {
    setCloudUsed(value: boolean) {
      this.isCloudUsed = value
    }
  }
})
