import { newStore } from '@shared/lib/pinia/store-define'

/** Pinia store tracking runtime network reachability. */
export const useNetworkStatusStore = newStore('network-status', {
  state: () => ({
    isOnline: true,
    isSupabaseReachable: true
  }),
  actions: {
    setOnline(value: boolean) {
      this.isOnline = value
    },
    setSupabaseReachable(value: boolean) {
      this.isSupabaseReachable = value
    }
  }
})
