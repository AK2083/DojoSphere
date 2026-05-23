import { newStore } from '@shared/lib'

export const useNetworkStatusStore = newStore('network-status', {
  state: () => ({
    isOnline: true
  }),
  actions: {
    setOnline(value: boolean) {
      this.isOnline = value
    }
  }
})
