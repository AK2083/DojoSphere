import { onMounted, onUnmounted, ref } from 'vue'
import { PARTICIPANTS_OVERVIEW_PERMISSION } from '@shared/constants/participants-overview-permission'

import { getCurrentSession } from '../service/get-current-session'
import { hasUserPermission } from '../service/has-user-permission'
import { onLocalAuthStateChanged } from '../service/local-auth-state'

/**
 * Reactive access flag for the participants overview navigation and routes.
 *
 * @returns Ref indicating whether the current session may read the participants overview.
 */
export function useParticipantsOverviewAccess() {
  const canReadParticipantsOverview = ref(false)

  async function refreshAccess() {
    const session = await getCurrentSession()

    if (!session) {
      canReadParticipantsOverview.value = false
      return
    }

    canReadParticipantsOverview.value = await hasUserPermission(
      PARTICIPANTS_OVERVIEW_PERMISSION.resource,
      PARTICIPANTS_OVERVIEW_PERMISSION.actions.read
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

  return { canReadParticipantsOverview }
}
