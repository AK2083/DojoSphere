import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { AuthSession } from '@shared/types'

import { watchAuthState } from '../api/watch-auth-state'
import { getCurrentSession } from '../service/get-current-session'
import { isLocalAuthSession } from '../service/is-local-auth-session'
import { onLocalAuthStateChanged } from '../service/local-auth-state'

/**
 * Composable for the current Supabase auth session (e.g. navigation, account page).
 *
 * On mount:
 * - Loads the initial session via the shared auth facade.
 * - Subscribes to auth state changes so that login, logout,
 *   and token refresh updates are reflected in the UI.
 *
 * On unmount, the subscription is removed to prevent lingering listeners.
 *
 * @returns Refs and derived values:
 * - `session` – current {@link Session} or `null` if logged out
 * - `isLoggedIn` – `true` as soon as a session exists
 * - `isCloudLoggedIn` – `true` for Supabase sessions only
 * - `user` – current {@link User} or `null`
 *
 * @example
 * const { isLoggedIn, user } = useAuthSession()
 */
export function useAuthSession() {
  const session = ref<AuthSession | null>(null)

  let subscription: { unsubscribe: () => void } | undefined
  let unsubscribeLocalAuth: (() => void) | undefined

  onMounted(async () => {
    const initial = await getCurrentSession()
    session.value = initial

    subscription = watchAuthState(({ session: newSession }) => {
      session.value = newSession
    })

    unsubscribeLocalAuth = onLocalAuthStateChanged((newSession) => {
      session.value = newSession
    })
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
    unsubscribeLocalAuth?.()
  })

  const isLoggedIn = computed(() => !!session.value)
  const isCloudLoggedIn = computed(() => !!session.value && !isLocalAuthSession(session.value))
  const user = computed(() => session.value?.user ?? null)

  return { session, isLoggedIn, isCloudLoggedIn, user }
}
