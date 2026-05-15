export {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  requestPasswordRecovery,
  resendSignUpConfirmation,
  signInByEmailPassword,
  signInWithOtp,
  signOut,
  signUpByEmailPassword,
  updateUserPassword,
  verifyOneTimePasswordByRecovery,
  verifyOneTimePasswordBySignUp
} from './supabase/auth/auth'
export { mapSupabaseError } from './supabase/map-supabase-error'
export type {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  Session,
  Subscription,
  User,
  UserResponse
} from './supabase/types/auth-user'
