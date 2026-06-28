import { watchAuthState } from '@features/authentication/api/watch-auth-state'
import { isLocalAuthSession } from '@features/authentication/service/is-local-auth-session'
import type { AuthSession } from '@shared/types'

import { useCloudStatusStore } from '../store'
import { hasSupabaseAuthSessionInStorage } from './cloud-status-storage'

/**
 * Updates cloud usage from the current Supabase auth session.
 *
 * Cloud usage is derived from Supabase session persistence only — not from a separate settings flag.
 *
 * @param session Current Supabase session or `null`.
 */
export function syncCloudUsageFromAuthSession(session: AuthSession | null): void {
  const store = useCloudStatusStore()
  const isCloudUsed =
    Boolean(session) && !isLocalAuthSession(session)
      ? true
      : session === null
        ? hasSupabaseAuthSessionInStorage()
        : false

  if (store.isCloudUsed === isCloudUsed) {
    return
  }

  store.setCloudUsed(isCloudUsed)
}

/**
 * Subscribes to Supabase auth state changes and keeps cloud usage in sync.
 *
 * @returns Unsubscribe function for the auth listener.
 */
export function bootstrapCloudStatusFromAuth(): () => void {
  const subscription = watchAuthState(({ session }) => {
    syncCloudUsageFromAuthSession(session)
  })

  return () => subscription.unsubscribe()
}
