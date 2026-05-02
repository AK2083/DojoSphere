import { getCurrentUser, type UserResponse } from '@shared/api'
import { captureException } from '@shared/lib'

/**
 * Fetches the current authenticated user from the API.
 *
 * @returns A promise that resolves to a `UserResponse` containing the user data or null if not authenticated.
 * In case of an error during the API call, the error is captured and logged, and the function returns a `UserResponse` with `user` set to null.
 */
export async function getCurrentUserState(): Promise<UserResponse> {
  const { data, error } = await getCurrentUser()

  if (error) {
    captureException(error, 'auth', 'getCurrentUser')

    return {
      data: { user: null },
      error
    }
  }

  return {
    data: {
      user: data.user ?? null
    },
    error: null
  }
}
