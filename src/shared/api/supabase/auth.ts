import { captureException } from '@shared/lib/glitchtip/logging'
import type { AuthResponse } from '@supabase/supabase-js'

import { supabase } from './client'

/**
 * Registers a new user using Supabase email/password authentication.
 *
 * This is a low-level API wrapper around Supabase's `auth.signUp` method.
 * It performs no error handling, mapping, or side effects.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the new account.
 *
 * @returns {Promise<AuthResponse>} The raw Supabase authentication response,
 * including `data` and `error`.
 *
 * @example
 * ```ts
 * const { data, error } = await signUpByEmailPassword('test@mail.com', 'secret')
 * ```
 *
 * @remarks
 * This function is intended for use in higher-level layers (e.g. features or entities),
 * where error handling, logging, and domain mapping should be implemented.
 */
export async function signUpByEmailPassword(
  email: string,
  password: string
): Promise<AuthResponse> {
  return supabase.auth.signUp({ email, password })
}

/**
 *
 * @param email
 * @param token
 */
export async function checkOtp(email: string, token: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })

  if (error) {
    captureException(error, 'auth', 'checkOtp')
    throw error
  }
}
