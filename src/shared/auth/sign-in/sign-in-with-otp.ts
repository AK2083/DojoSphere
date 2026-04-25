import { mapSupabaseError, signInWithOtp } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import type { RegisterResult } from '@shared/types'

/**
 * Initiates the sign-in process using a one-time password (OTP) sent to the user's email.
 *
 * This function is a higher-level wrapper around `signInWithOtp` that includes error handling and mapping.
 * It returns a simplified result indicating success or failure, along with any mapped error information.
 * @param email - The email address of the user to sign in.
 * @returns A promise that resolves to a RegisterResult indicating success or failure.
 */
export async function signInWithOneTimePassword(email: string): Promise<RegisterResult> {
  const { error } = await signInWithOtp(email)

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
