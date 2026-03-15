import { mapSupabaseError } from '@shared/api/supabase/map-error'
import { captureException } from '@shared/lib/glitchtip/logging'
import type { RegisterResult } from '@shared/types'

import { supabase } from './client'

/**
 * Registers a new user using Supabase authentication.
 *
 * The function sends the provided email and password to Supabase to
 * create a new user account. If Supabase returns an error, the error
 * is captured via {@link captureException}, mapped to an application-
 * specific {@link AppError} using {@link mapSupabaseError}, and then thrown.
 *
 * @param {string} email - The email address for the new user account.
 * @param {string} password - The password for the new user account.
 *
 * @returns {Promise<RegisterResult>} The registration result returned by Supabase.
 *
 * @throws {AppError} If the registration fails.
 */
export async function registerUser(email: string, password: string): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if (error) {
    captureException(error, 'auth', 'registerUser')
    throw mapSupabaseError(error)
  }

  return data
}
