import { createSession } from '@main/features/sessions'

import { addUser, type CreateUserInput } from '../repository/users.repository'

/**
 * Creates a user and, for local users, an initial session.
 *
 * @param user - User fields to persist.
 * @returns User identifier and optional session credentials for local users.
 */
export function addUserWithSession(user: CreateUserInput) {
  const result = addUser(user)
  const userType = user.userType ?? 'local'

  if (userType !== 'local') {
    return result
  }

  const session = createSession(result.id)

  return {
    ...result,
    sessionToken: session.token,
    expiresAt: session.expiresAt
  }
}
