import { mapSupabaseError, signOut } from '@shared/api'
import { captureException, clearUserContext } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

import { clearRegisterStorage } from '../../register-user/service/register-storage'

/**
 * Executes the sign-out use-case for the authentication feature.
 *
 * On success, this clears user context and stale register progress from storage.
 * On failure, Supabase errors are mapped to app-level errors for UI consumption.
 *
 * @returns Authentication action result indicating success or mapped failure.
 */
export async function signOutUser(): Promise<AuthActionResult> {
  const { error } = await signOut()

  if (error) {
    const mapped = mapSupabaseError(error)

    if (mapped.code !== 'shared.error.retry') {
      captureException(mapped, 'auth', 'signOutUser')
    }

    return {
      success: false,
      error: mapped
    }
  }

  clearUserContext()
  clearRegisterStorage()

  return { success: true }
}
