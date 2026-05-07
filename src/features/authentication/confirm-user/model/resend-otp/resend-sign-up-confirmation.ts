import { mapSupabaseError, resendSignUpConfirmation } from '@shared/api'
import { captureException } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Resends sign-up confirmation mail via Supabase.
 * @param email - The email address to resend the confirmation mail to.
 * @returns {success: boolean, error: string | null}
 */
export async function resendSignUpConfirmationEmail(email: string): Promise<AuthActionResult> {
  const { error } = await resendSignUpConfirmation(email)

  if (error) {
    captureException(error, 'auth', 'resendSignUpConfirmationEmail')
    return {
      success: false,
      error: mapSupabaseError(error)
    }
  }

  return { success: true }
}
