import { getCurrentSession as getCurrentSessionLowLevel } from '@shared/api'
import type { AuthSession } from '@shared/types'

import { resolveLocalAuthSession } from './resolve-local-auth-session'

/**
 * Returns the current auth session via the shared auth facade.
 * Falls back to a validated local SQLite session when no Supabase session exists.
 *
 * @returns The current auth session or null if no session is found.
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  const supabaseSession = await getCurrentSessionLowLevel()

  if (supabaseSession) {
    return supabaseSession
  }

  return resolveLocalAuthSession()
}
