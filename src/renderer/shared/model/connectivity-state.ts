import { type Ref, ref } from 'vue'
import { getNavigatorOnline } from '@shared/lib'

type ConnectivityRefs = {
  isOnline: Ref<boolean>
  isCloudUsed: Ref<boolean>
}

let connectivityState: ConnectivityRefs = {
  isOnline: ref(getNavigatorOnline()),
  isCloudUsed: ref(true)
}

/**
 * Binds shared connectivity refs to reactive store state from the status feature.
 * @param refs Reactive online and cloud-usage refs.
 */
export function bindConnectivityState(refs: ConnectivityRefs) {
  connectivityState = refs
}

/**
 * Read-only connectivity facade for features outside the status slice.
 * @returns Reactive online and cloud-usage refs.
 */
export function useNetworkStatusState(): ConnectivityRefs {
  return connectivityState
}
