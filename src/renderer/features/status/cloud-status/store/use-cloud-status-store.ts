import { newStore } from '@shared/lib/pinia/store-define'

import { hasSupabaseAuthSessionInStorage } from '../service/cloud-status-storage'

/** Pinia store tracking whether a Supabase cloud session is active. */
export const useCloudStatusStore = newStore('cloud-status', {
  state: () => ({
    isCloudUsed: hasSupabaseAuthSessionInStorage()
  }),
  actions: {
    setCloudUsed(value: boolean) {
      this.isCloudUsed = value
    }
  }
})
