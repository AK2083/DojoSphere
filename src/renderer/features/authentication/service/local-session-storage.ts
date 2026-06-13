const LOCAL_SESSION_STORAGE_KEY = 'dojosphere.auth.local.session'

/**
 * Returns the persisted local session token, if any.
 *
 * @returns The stored token or `null`.
 */
export function getLocalSessionToken() {
  return globalThis.localStorage.getItem(LOCAL_SESSION_STORAGE_KEY)
}

/**
 * Persists the local session token for subsequent auth checks.
 *
 * @param token - Raw session token returned by the main process.
 */
export function setLocalSessionToken(token: string) {
  globalThis.localStorage.setItem(LOCAL_SESSION_STORAGE_KEY, token)
}

/**
 * Removes the persisted local session token.
 */
export function clearLocalSessionToken() {
  globalThis.localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY)
}
