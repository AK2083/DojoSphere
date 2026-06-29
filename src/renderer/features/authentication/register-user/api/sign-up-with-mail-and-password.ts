import { mapSupabaseError, signUpByEmailPassword } from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Registers a new user using Supabase authentication.
 *
 * @param email - The email address of the user to sign up.
 * @param password - The password of the user to sign up.
 * @returns A promise that resolves to an AuthActionResult.
 */
export async function signUpWithMailAndPassword(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const { data, error } = await signUpByEmailPassword(email, password)

  if (error) {
    const mappedError = mapSupabaseError(error)
    logError(mappedError, 'auth', 'signUpWithMailAndPassword')

    return {
      success: false,
      error: mappedError
    }
  }

  if (!data.user) {
    const err = new AppError('unknown', 'User not found')
    logError(err, 'auth', 'signUpWithMailAndPassword')

    return {
      success: false,
      error: err
    }
  }

  return { success: true }
}
