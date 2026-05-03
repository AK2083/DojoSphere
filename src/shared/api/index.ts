export {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  resendSignUpConfirmation,
  signInByEmailPassword,
  signInWithOtp,
  signUpByEmailPassword,
  updateUserPassword,
  verifyOneTimePasswordByRecovery,
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
  User,
  UserResponse
} from './supabase/types/auth-user'
