import { createSession } from '@main/features/sessions'

import { addUser, findLocalUserByDisplayName } from '../repository/users.repository'

/**
 * Ensures a local user exists for the display name and returns a fresh session.
 *
 * @param displayName - Display name for lookup or creation.
 * @returns User identifier and new session credentials.
 */
export function ensureLocalUserSession(displayName: string) {
  const existingUser = findLocalUserByDisplayName(displayName)
  const userId = existingUser?.id ?? addUser({ displayName, userType: 'local' }).id
  const session = createSession(userId)

  return {
    id: userId,
    sessionToken: session.token,
    expiresAt: session.expiresAt
  }
}
