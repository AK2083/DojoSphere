import type { AuthResponse } from '@supabase/supabase-js'

import { supabase } from '../client'

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
 * Verifies a one-time password (OTP) for email-based sign-up using Supabase.
 *
 * This function wraps Supabase's `auth.verifyOtp` method and confirms a user's
 * email address during the sign-up flow. It performs no error handling or
 * side effects and returns the raw Supabase response.
 *
 * @param {string} email - The email address associated with the OTP.
 * @param {string} token - The one-time password (OTP) sent to the user's email.
 *
 * @returns {Promise<AuthResponse>} The raw authentication response from Supabase,
 * containing `data` (user/session) and `error`.
 *
 * @example
 * ```ts
 * const { data, error } = await checkOtp('test@mail.com', '123456')
 * ```
 *
 * @remarks
 * This is a low-level API function intended to be used in higher-level layers
 * (e.g. features or entities), where error handling, logging, and domain-specific
 * logic should be implemented.
 */
export async function verifyOneTimePassword(email: string, token: string): Promise<AuthResponse> {
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })
}

/**
 * Resends the email confirmation link for a sign-up flow.
 *
 * This is a low-level API wrapper around Supabase's `auth.resend` method.
 * It performs no error handling and returns the raw Supabase response.
 *
 * @param {string} email - The email address that should receive a new confirmation link.
 * @returns {Promise<Awaited<ReturnType<typeof supabase.auth.resend>>>} The raw Supabase resend response.
 */
export async function resendSignUpConfirmation(
  email: string
): Promise<Awaited<ReturnType<typeof supabase.auth.resend>>> {
  return await supabase.auth.resend({
    type: 'signup',
    email
  })
}
