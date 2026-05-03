import { getCurrentUser } from '@shared/api'
import { captureException } from '@shared/lib'

import type { CurrentUserState } from '../../types/auth-identity'

/**
 * Fetches the current authenticated user from the API.
 *
 * @returns A promise with high-level user state.
 * In case of an API error, the error is captured and returned alongside a `null` user.
 */
export async function getCurrentUserState(): Promise<CurrentUserState> {
  const { data, error } = await getCurrentUser()

  if (error) {
    captureException(error, 'auth', 'getCurrentUser')

    return {
      user: null,
      error
    }
  }

  return {
    user: data.user ?? null,
    error: null
  }
}
