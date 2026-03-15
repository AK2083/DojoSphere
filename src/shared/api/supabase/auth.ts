import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import type { RegisterResult } from '@shared/types/auth'

import { supabase } from './client'

/**
 * Registers a new user via Supabase authentication.
 *
 * The function attempts to create a new account using the provided
 * email and password. If Supabase returns an error, the exception
 * is captured via {@link captureException} and rethrown.
 *
 * After a successful sign-up, the authenticated user's ID is stored
 * in the monitoring context via {@link setUserContext}.
 *
 * @param {string} email - The email address used to create the account.
 * @param {string} password - The password for the new account.
 *
 * @returns {Promise<RegisterResult>} The registration result returned by Supabase.
 *
 * @throws {Error} If Supabase returns an error or no user is returned
 * after the sign-up process.
 */
export async function signUp(email: string, password: string): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    captureException(error, 'auth', 'signUp')
    throw error
  }

  if (!data.user) {
    const err = new Error('User not found after sign up')
    captureException(err, 'auth', 'signUp')
    throw err
  }

  setUserContext({
    id: data.user.id
  })

  return data
}

/**
 * Verifies a one-time password (OTP) for email confirmation during sign-up.
 *
 * This function calls Supabase to validate the OTP that was sent to the user
 * during the registration process. If verification fails, the error is
 * captured via {@link captureException} and rethrown.
 *
 * @param {string} email - The email address used during registration.
 * @param {string} token - The OTP token received by the user.
 *
 * @returns {Promise<void>} Resolves when the OTP verification succeeds.
 *
 * @throws {Error} If the OTP verification fails.
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
