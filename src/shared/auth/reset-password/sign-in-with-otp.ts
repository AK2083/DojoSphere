import { mapSupabaseError, requestPasswordRecovery } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Initiates the sign-in process using a one-time password (OTP) sent to the user's email.
 *
 * This function is a higher-level wrapper around `requestPasswordRecovery` that includes error handling and mapping.
 * It returns a simplified result indicating success or failure, along with any mapped error information.
 * @param email - The email address of the user to sign in.
 * @returns A promise that resolves to an AuthActionResult indicating success or failure.
 */
export async function signInWithOneTimePassword(email: string): Promise<AuthActionResult> {
  const { error } = await requestPasswordRecovery(email)

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
  captureException(error, 'auth', 'signInWithOneTimePassword')
}
