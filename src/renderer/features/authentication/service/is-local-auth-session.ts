import type { AuthSession } from '@shared/types'

/**
 * Returns whether the given session was created by local work sign-in.
 *
 * @param session - Current auth session or `null`.
 * @returns `true` for SQLite-backed local sessions.
 */
export function isLocalAuthSession(session: AuthSession | null) {
  if (!session) {
    return false
  }

  const provider = session.user.app_metadata?.provider

  return provider === 'local'
}
