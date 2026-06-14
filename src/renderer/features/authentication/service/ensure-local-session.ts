import { setUserContext } from '@shared/lib'

import { getCurrentSession } from './get-current-session'
import { notifyLocalAuthStateChanged } from './local-auth-state'
import { setLocalSessionToken } from './local-session-storage'

/**
 * Ensures a local SQLite-backed session exists using the OS username.
 *
 * @returns Whether a local session is active after bootstrap.
 */
export async function ensureLocalSessionFromOsUsername(): Promise<boolean> {
  if (await getCurrentSession()) {
    return true
  }

  const displayName = (await globalThis.window.api.getOsUsername()).trim()

  if (!displayName) {
    return false
  }

  const result = await globalThis.window.api.ensureLocalSession(displayName)

  if (!result.sessionToken) {
    return false
  }

  setLocalSessionToken(result.sessionToken)
  setUserContext({ id: result.id })

  const session = await getCurrentSession()
  notifyLocalAuthStateChanged(session)

  return Boolean(session)
}
