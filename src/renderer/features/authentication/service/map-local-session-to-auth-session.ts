import type { AuthSession, AuthUser } from '@shared/types'
import type { LocalSession } from '@shared/types/electron-api'

/**
 * Maps a validated local SQLite session to the shared auth session shape.
 *
 * @param localSession - Session record returned by the main process.
 * @returns Auth session compatible with existing auth consumers.
 */
export function mapLocalSessionToAuthSession(localSession: LocalSession): AuthSession {
  const expiresAt = Math.floor(new Date(localSession.expiresAt).getTime() / 1000)

  const user = {
    id: localSession.user.id,
    email: localSession.user.email ?? undefined,
    app_metadata: {
      provider: 'local'
    },
    user_metadata: {
      full_name: localSession.user.displayName,
      name: localSession.user.displayName
    },
    aud: 'authenticated',
    created_at: localSession.user.createdAt
  } as AuthUser

  return {
    access_token: '',
    token_type: 'bearer',
    expires_in: Math.max(expiresAt - Math.floor(Date.now() / 1000), 0),
    expires_at: expiresAt,
    refresh_token: '',
    user
  } as AuthSession
}
