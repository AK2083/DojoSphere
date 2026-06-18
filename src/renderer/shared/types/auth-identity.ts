import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'

/** Supabase auth session alias used across authentication features. */
export type AuthSession = Session

/** Supabase user alias used across authentication features. */
export type AuthUser = User

/** Low-level Supabase auth change event from the client SDK. */
export type LowLevelAuthEvent = AuthChangeEvent

/** Normalized auth lifecycle event used by application listeners. */
export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'INITIAL_SESSION'
  | 'UNKNOWN'

/** Auth state snapshot passed to auth state change callbacks. */
export interface AuthState {
  session: AuthSession | null
  event: AuthEvent
}

/** Result of resolving the current authenticated user. */
export type CurrentUserState = {
  user: AuthUser | null
  error: Error | null
}
