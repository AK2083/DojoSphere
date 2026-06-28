import { mapSupabaseError, verifyOneTimePasswordByRecovery } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Checks a one-time password (OTP) for password recovery.
 * @param email - User email address associated with the recovery flow.
 * @param token - One-time password sent to the user.
 * @returns Result containing success state or mapped error details.
 */
export async function checkOneTimePasswordByRecovery(
  email: string,
  token: string
): Promise<AuthActionResult> {
  const { error } = await verifyOneTimePasswordByRecovery(email, token)

  if (error) {
    const mappedError = mapSupabaseError(error)
    logError(mappedError, 'auth', 'checkOneTimePasswordByRecovery')

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}
