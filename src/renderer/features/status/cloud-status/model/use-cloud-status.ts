import { newStoreToRefs } from '@shared/lib'

import { useCloudStatusStore } from '../store'

/**
 * Composable for the cloud status.
 * @returns The cloud status.
 */
export function useCloudStatus() {
  const cloudStatusStore = useCloudStatusStore()
  const { isCloudUsed } = newStoreToRefs(cloudStatusStore)

  return { isCloudUsed }
}
