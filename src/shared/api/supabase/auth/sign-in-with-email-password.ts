import { mapSupabaseError } from '@shared/api/supabase/map-supabase-error'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import type { RegisterResult } from '@shared/types/register-result'

import { signInByEmailPassword } from './auth'

/**
 * Signs in a user with email and password via Supabase.
 *
 * On failure, maps the Supabase error and reports it via {@link captureException}.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns Success or a mapped {@link AppError}
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<RegisterResult> {
  const { data, error } = await signInByEmailPassword(email, password)

  if (error) {
    const mapped = mapSupabaseError(error)
    captureException(mapped, 'auth', 'signInWithEmailPassword')

    return {
      success: false,
      error: mapped
    }
  }

  if (!data.user) {
    const err = new AppError('unknown', 'User not found')
    captureException(err, 'auth', 'signInWithEmailPassword')

    return {
      success: false,
      error: err
    }
  }

  setUserContext({ id: data.user.id })
  return { success: true }
}
