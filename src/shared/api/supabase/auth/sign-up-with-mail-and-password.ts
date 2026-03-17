import { mapSupabaseError } from '@shared/api/supabase/map-supabase-error'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import type { RegisterResult } from '@shared/types/register-result'

import { signUpByEmailPassword } from './auth'

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
 * @returns {Promise<RegisterResult>} The registration result returned.
 */
export async function signUpWithMailAndPassword(
  email: string,
  password: string
): Promise<RegisterResult> {
  const { data, error } = await signUpByEmailPassword(email, password)

  if (error) {
    saveException(mapSupabaseError(error))

    return {
      success: false,
      error: mapSupabaseError(error)
    }
  }

  if (!data.user) {
    const err = new AppError('unknown', 'User not found')
    saveException(err)

    return {
      success: false,
      error: err
    }
  }

  setUserContext({ id: data.user.id })
  return { success: true }
}

function saveException(error: AppError) {
  captureException(error, 'auth', 'signUpWithMailAndPassword')
}
