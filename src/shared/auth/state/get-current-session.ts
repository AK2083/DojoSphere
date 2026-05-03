import { getCurrentSession as getCurrentSessionLowLevel } from '@shared/api'
import type { AuthSession } from '@shared/types'

/**
 * Returns the current auth session via the high-level auth facade.
 * This keeps Supabase specific implementation details out of features/app.
 * @returns The current auth session or null if no session is found.
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  return getCurrentSessionLowLevel()
}
