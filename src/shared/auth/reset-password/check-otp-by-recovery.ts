import { mapSupabaseError, verifyOneTimePasswordByRecovery } from '@shared/api'
import { captureException } from '@shared/lib'
import type { RegisterResult } from '@shared/types'

/**
 * Checks the validity of a one-time password (OTP) for password recovery.
 * This function calls the Supabase API to verify the OTP associated with the provided email address.
 *
 * @param email The email address associated with the OTP to verify.
 * @param token The one-time password token to verify.
 * @returns A promise that resolves to a RegisterResult indicating success or failure of the OTP verification.
 */
export async function checkOneTimePasswordByRecovery(
  email: string,
  token: string
): Promise<RegisterResult> {
  const { error } = await verifyOneTimePasswordByRecovery(email, token)

  if (error) {
    captureException(error, 'auth', 'checkOneTimePasswordByRecovery')
    return {
      success: false,
      error: mapSupabaseError(error)
    }
  }

  return { success: true }
}
