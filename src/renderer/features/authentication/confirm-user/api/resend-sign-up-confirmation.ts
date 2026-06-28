import { mapSupabaseError, resendSignUpConfirmation } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Resends sign-up confirmation mail via Supabase.
 * @param email - The email address to resend the confirmation mail to.
 * @returns {success: boolean, error: string | null}
 */
export async function resendSignUpConfirmationEmail(email: string): Promise<AuthActionResult> {
  const { error } = await resendSignUpConfirmation(email)

  if (error) {
    const mappedError = mapSupabaseError(error)
    logError(mappedError, 'auth', 'resendSignUpConfirmationEmail')

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}
