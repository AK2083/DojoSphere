import { onMounted, onUnmounted, ref } from 'vue'
import { ASSOCIATIONS_OVERVIEW_PERMISSION } from '@shared/constants/associations-overview-permission'

import { getCurrentSession } from '../service/get-current-session'
import { hasUserPermission } from '../service/has-user-permission'
import { onLocalAuthStateChanged } from '../service/local-auth-state'

/**
 * Reactive access flag for the associations overview navigation and routes.
 *
 * @returns Ref indicating whether the current session may read the associations overview.
 */
export function useAssociationsOverviewAccess() {
  const canReadAssociationsOverview = ref(false)

  async function refreshAccess() {
    const session = await getCurrentSession()

    if (!session) {
      canReadAssociationsOverview.value = false
      return
    }

    canReadAssociationsOverview.value = await hasUserPermission(
      ASSOCIATIONS_OVERVIEW_PERMISSION.resource,
      ASSOCIATIONS_OVERVIEW_PERMISSION.actions.read
    )
  }

  let unsubscribeLocalAuth: (() => void) | undefined

  onMounted(() => {
    void refreshAccess()
    unsubscribeLocalAuth = onLocalAuthStateChanged(() => {
      void refreshAccess()
    })
  })

  onUnmounted(() => {
    unsubscribeLocalAuth?.()
  })

  return { canReadAssociationsOverview }
}
