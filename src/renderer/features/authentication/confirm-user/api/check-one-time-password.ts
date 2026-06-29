import { mapSupabaseError, verifyOneTimePasswordBySignUp } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Verifies a one-time password (OTP) during sign-up confirmation.
 * @param email - The email address associated with the OTP.
 * @param token - The one-time password (OTP) sent to the user.
 * @returns {success: boolean, error: string | null}
 */
export async function checkOneTimePassword(
  email: string,
  token: string
): Promise<AuthActionResult> {
  const { error } = await verifyOneTimePasswordBySignUp(email, token)

  if (error) {
    const mappedError = mapSupabaseError(error)
    logError(mappedError, 'auth', 'checkOneTimePassword')

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}
