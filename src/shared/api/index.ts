export {
  onAuthStateChange,
  resendSignUpConfirmation,
  signInByEmailPassword,
  signInWithOtp,
  signUpByEmailPassword,
  verifyOneTimePasswordBySignUp
} from './supabase/auth/auth'
export { mapSupabaseError } from './supabase/map-supabase-error'
export type {
  AuthChangeEvent,
  AuthError,
  AuthEvent,
  AuthOtpResponse,
  AuthResponse,
  AuthState,
  Session,
  Subscription,
  User
} from './supabase/types/auth-user'
