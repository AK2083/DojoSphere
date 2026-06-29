import { mapSupabaseError, signInByEmailPassword } from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Signs in a user with email and password via Supabase.
 *
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

    if (mapped.code !== 'auth.invalid_credentials' && mapped.code !== 'invalid_credentials') {
      logError(mapped, 'auth', 'signInWithEmailPassword')
    }

    return {
      success: false,
      error: mapped
    }
  }

  if (!data || !data.user) {
    const err = new AppError('unknown', 'User not found')
    logError(err, 'auth', 'signInWithEmailPassword')

    return {
      success: false,
      error: err
    }
  }

  return { success: true }
}
