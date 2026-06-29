import {
  getLocalSessionToken,
  setLocalSessionToken
} from '@features/authentication/service/local-session-storage'

/**
 * Ensures a local SQLite session exists when no local token is persisted yet.
 *
 * Unlike {@link ensureLocalSessionFromOsUsername}, this does not skip bootstrap
 * when a cloud session is already active.
 *
 * @returns Whether a local session token is available after bootstrap.
 */
export async function ensureLocalSessionForUsername(): Promise<boolean> {
  if (getLocalSessionToken()) {
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

  return true
}
