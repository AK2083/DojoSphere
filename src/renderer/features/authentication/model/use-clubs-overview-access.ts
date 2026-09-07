import { onMounted, onUnmounted, ref } from 'vue'
import { CLUBS_OVERVIEW_PERMISSION } from '@shared/constants/clubs-overview-permission'

import { getCurrentSession } from '../service/get-current-session'
import { hasUserPermission } from '../service/has-user-permission'
import { onLocalAuthStateChanged } from '../service/local-auth-state'

/**
 * Reactive access flag for the clubs overview navigation and routes.
 *
 * @returns Ref indicating whether the current session may read the clubs overview.
 */
export function useClubsOverviewAccess() {
  const canReadClubsOverview = ref(false)

  async function refreshAccess() {
    const session = await getCurrentSession()

    if (!session) {
      canReadClubsOverview.value = false
      return
    }

    canReadClubsOverview.value = await hasUserPermission(
      CLUBS_OVERVIEW_PERMISSION.resource,
      CLUBS_OVERVIEW_PERMISSION.actions.read
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

  return { canReadClubsOverview }
}
