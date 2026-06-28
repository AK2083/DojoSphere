import { mapSupabaseError, updateUserPassword } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Updates the currently authenticated user's password.
 * @param password - The new password that should be stored for the current user.
 * @returns Result containing success state or mapped error details.
 */
export async function setNewPassword(password: string): Promise<AuthActionResult> {
  const { error } = await updateUserPassword(password)

  if (error) {
    const mappedError = mapSupabaseError(error)
    logError(mappedError, 'auth', 'setNewPassword')

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}
