import { mapSupabaseError, updateUserPassword } from '@shared/api'
import type { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Sends a password reset email to the user. The email contains a link that allows the user to set a new password.
 *
 * @param password - The new password that the user wants to set.
 * @returns A promise that resolves to an object indicating whether the operation was successful or if there was an error.
 */
export async function setNewPassword(password: string): Promise<AuthActionResult> {
  const { error } = await updateUserPassword(password)

  if (error) {
    const mappedError = mapSupabaseError(error)
    saveException(mappedError)

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}

function saveException(error: AppError) {
  captureException(error, 'auth', 'setNewPassword')
}
