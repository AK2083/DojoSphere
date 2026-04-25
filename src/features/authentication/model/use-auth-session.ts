import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Session } from '@shared/api'
import { getCurrentSession, watchAuthState } from '@shared/auth'

/**
 * Composable for the current Supabase auth session (e.g. navigation, account page).
 *
 * On mount:
 * - Loads the initial session using `supabase.auth.getSession()`.
 * - Subscribes to `supabase.auth.onAuthStateChange` so that login, logout,
 *   and token refresh updates are reflected in the UI.
 *
 * On unmount, the subscription is removed to prevent lingering listeners.
 *
 * @returns Refs and derived values:
 * - `session` – current {@link Session} or `null` if logged out
 * - `isLoggedIn` – `true` as soon as a session exists
 * - `user` – current {@link User} or `null`
 *
 * @example
 * const { isLoggedIn, user } = useAuthSession()
 */
export function useAuthSession() {
  const session = ref<Session | null>(null)

  let subscription: { unsubscribe: () => void } | undefined

  onMounted(async () => {
    const initial = await getCurrentSession()
    session.value = initial

    subscription = watchAuthState(({ event: _, session: newSession }) => {
      session.value = newSession
    })
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
  })

  const isLoggedIn = computed(() => !!session.value)
  const user = computed(() => session.value?.user ?? null)

  return { session, isLoggedIn, user }
}
