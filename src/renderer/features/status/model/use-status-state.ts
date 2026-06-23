import { ref } from 'vue'
import { getActiveStore, getNavigatorOnline, newStoreToRefs } from '@shared/lib'

import { useCloudStatusStore } from '../cloud-status/store'
import { useNetworkStatusStore } from '../network-status/store'

/**
 * Exposes reactive network and cloud status refs from Pinia stores.
 * @returns Reactive online and cloud-usage refs.
 */
export function useStatusState() {
  const activeStore = getActiveStore()

  if (!activeStore) {
    return {
      isOnline: ref(getNavigatorOnline()),
      isCloudUsed: ref(true),
      isSupabaseReachable: ref(true),
      isGrafanaCloudReachable: ref(false)
    }
  }

  const { isOnline, isSupabaseReachable, isGrafanaCloudReachable } = newStoreToRefs(
    useNetworkStatusStore(activeStore)
  )
  const { isCloudUsed } = newStoreToRefs(useCloudStatusStore(activeStore))

  return { isOnline, isCloudUsed, isSupabaseReachable, isGrafanaCloudReachable }
}
