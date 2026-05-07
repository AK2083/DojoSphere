import { mapSupabaseError, signInByEmailPassword } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Signs in a user with email and password via Supabase.
 *
 * On failure, maps the Supabase error and reports it via captureException.
 * @param email - User email address.
 * @param password - User password.
 * @returns Result containing success state or mapped error details.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const { data, error } = await signInByEmailPassword(email, password)

  if (error) {
    const mapped = mapSupabaseError(error)

    // Invalid credentials are an expected user-facing outcome and should not be tracked as exceptions.
    if (mapped.code !== 'auth.invalid_credentials' && mapped.code !== 'invalid_credentials') {
      captureException(mapped, 'auth', 'signInWithEmailPassword')
    }

    return {
      success: false,
      error: mapped
    }
  }

  if (!data || !data.user) {
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
