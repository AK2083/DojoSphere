import { mapSupabaseError, requestPasswordRecovery } from '@shared/api'
import { captureException } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

/**
 * Initiates password recovery using a one-time password email.
 * @param email - The email address of the user to sign in.
 * @returns A promise that resolves to an AuthActionResult.
 */
export async function signInWithOneTimePassword(email: string): Promise<AuthActionResult> {
  const { error } = await requestPasswordRecovery(email)

  if (error) {
    const mappedError = mapSupabaseError(error)
    captureException(mappedError, 'auth', 'signInWithOneTimePassword')

    return {
      success: false,
      error: mappedError
    }
  }

  return { success: true }
}
