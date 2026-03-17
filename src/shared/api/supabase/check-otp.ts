import { captureException } from '@shared/lib'
import type { RegisterResult } from '@shared/types'

import { verifyOneTimePassword } from './auth'
import { mapSupabaseError } from './map-supabase-error'

/**
 * Verifies a one-time password (OTP) for a user's email during sign-up.
 *
 * This use-case function calls the underlying OTP verification API and handles
 * error mapping and monitoring. If verification fails, the error is captured
 * and transformed into an application-specific {@link AppError}.
 *
 * @param {string} email - The email address associated with the OTP.
 * @param {string} token - The one-time password (OTP) sent to the user.
 *
 * @param token
 * @returns {Promise<RegisterResult>} An object indicating whether the verification
 * was successful. On failure, contains a mapped {@link AppError}.
 *
 * @example
 * ```ts
 * const result = await checkOneTimePassword(email, token)
 *
 * if (!result.success) {
 *   showError(result.error)
 * }
 * ```
 */
export async function checkOneTimePassword(email: string, token: string): Promise<RegisterResult> {
  const { error } = await verifyOneTimePassword(email, token)

  if (error) {
    captureException(error, 'auth', 'checkOneTimePassword')
    return {
      success: false,
      error: mapSupabaseError(error)
    }
  }

  return { success: true }
}
