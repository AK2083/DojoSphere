import { mapSupabaseError, signOut } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Signs the user out of the Supabase session.
 *
 * @returns Authentication action result indicating success or mapped failure.
 */
export async function signOutFromSupabase(): Promise<AuthActionResult> {
  const { error } = await signOut()

  if (!error) {
    return { success: true }
  }

  const mapped = mapSupabaseError(error)

  if (mapped.code !== 'shared.error.retry') {
    logError(mapped, 'auth', 'signOutUser')
  }

  return {
    success: false,
    error: mapped
  }
}
