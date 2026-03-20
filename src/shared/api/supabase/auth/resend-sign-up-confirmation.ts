import { captureException } from '@shared/lib'
import type { RegisterResult } from '@shared/types'

import { mapSupabaseError } from '../map-supabase-error'
import { resendSignUpConfirmation } from './auth'

/**
 * Resends a sign-up confirmation email via Supabase.
 *
 * Handles Supabase errors by mapping them to application-specific errors
 * and forwarding them to monitoring.
 *
 * @param {string} email - The email that should receive a new confirmation link.
 * @returns {Promise<RegisterResult>} Success flag or mapped error payload.
 */
export async function resendSignUpConfirmationEmail(email: string): Promise<RegisterResult> {
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
