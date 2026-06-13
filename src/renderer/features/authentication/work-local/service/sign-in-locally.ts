import { setUserContext } from '@shared/lib'

import { getCurrentSession } from '../../service/get-current-session'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { setLocalSessionToken } from '../../service/local-session-storage'

/**
 * Creates a local user, persists a SQLite-backed session, and activates local auth state.
 *
 * @param displayName - Display name entered for local work.
 * @returns Whether sign-in succeeded.
 */
export async function signInLocally(displayName: string) {
  const result = await globalThis.window.api.addUser({
    displayName,
    userType: 'local'
  })

  if (!result.sessionToken) {
    return false
  }

  setLocalSessionToken(result.sessionToken)
  setUserContext({ id: result.id })

  const session = await getCurrentSession()
  notifyLocalAuthStateChanged(session)

  return Boolean(session)
}
