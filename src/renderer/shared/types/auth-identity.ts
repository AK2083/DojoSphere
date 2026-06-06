import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'

export type AuthSession = Session
export type AuthUser = User
export type LowLevelAuthEvent = AuthChangeEvent

export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'INITIAL_SESSION'
  | 'UNKNOWN'

export interface AuthState {
  session: AuthSession | null
  event: AuthEvent
}

export type CurrentUserState = {
  user: AuthUser | null
  error: Error | null
}
