import { computed, onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '@shared/api/supabase/client'
import type { Session, User } from '@supabase/supabase-js'

/**
 * Composable für die aktuelle Supabase-Auth-Session (z. B. Navigation, Account-Seite).
 *
 * Beim Mount:
 * - Lädt die initiale Session mit `supabase.auth.getSession()`.
 * - Abonniert `supabase.auth.onAuthStateChange`, damit Login, Logout und Token-Refresh die UI mitbekommen.
 *
 * Beim Unmount wird das Abo beendet, damit keine Listener hängen bleiben.
 *
 * @returns Refs und abgeleitete Werte:
 * - `session` – aktuelle {@link Session} oder `null`, wenn abgemeldet
 * - `isLoggedIn` – `true`, sobald eine Session existiert
 * - `user` – aktueller {@link User} oder `null`
 *
 * @example
 * const { isLoggedIn, user } = useAuthSession()
 */
export function useAuthSession() {
  const session = ref<Session | null>(null)

  let subscription: { unsubscribe: () => void } | undefined

  onMounted(async () => {
    const {
      data: { session: initial }
    } = await supabase.auth.getSession()
    session.value = initial

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
    })
    subscription = data.subscription
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
  })

  const isLoggedIn = computed(() => !!session.value)
  const user = computed<User | null>(() => session.value?.user ?? null)

  return { session, isLoggedIn, user }
}
