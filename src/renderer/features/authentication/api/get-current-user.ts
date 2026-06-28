import { getCurrentUser } from '@shared/api'
import { logError } from '@shared/lib'
import type { CurrentUserState } from '@shared/types'

/**
 * Fetches the current authenticated user from the API.
 *
 * @returns A promise with high-level user state.
 */
export async function getCurrentUserState(): Promise<CurrentUserState> {
  const { data, error } = await getCurrentUser()

  if (error) {
    logError(error, 'auth', 'getCurrentUser')

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
