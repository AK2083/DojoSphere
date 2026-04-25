import type {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  Session,
  Subscription,
  User
} from '@supabase/supabase-js'

export type {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  Session,
  Subscription,
  User
}

export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'INITIAL_SESSION'
  | 'UNKNOWN'

export interface AuthState {
  session: Session | null
  event: AuthEvent
}
