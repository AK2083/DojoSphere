import { createSession } from '@main/features/sessions'

import { addUser, findLocalUserByDisplayName } from '../repository/users.repository'

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
