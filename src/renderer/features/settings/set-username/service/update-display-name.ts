import { notifyLocalAuthStateChanged } from '@features/authentication/service/local-auth-state'
import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { resolveLocalAuthSession } from '@features/authentication/service/resolve-local-auth-session'
import type { User } from '@shared/types/electron-api'

/**
 * Updates the local user's display name in SQLite and refreshes auth state.
 *
 * @param displayName - New display name for the current local user.
 * @returns Updated user record from the main process.
 */
export async function updateDisplayName(displayName: string): Promise<User> {
  const token = getLocalSessionToken()

  if (!token || !globalThis.window.api?.updateUserDisplayName) {
    throw new Error('No local session')
  }

  const updatedUser = await globalThis.window.api.updateUserDisplayName(token, displayName)
  const session = await resolveLocalAuthSession()

  notifyLocalAuthStateChanged(session)

  return updatedUser
}
