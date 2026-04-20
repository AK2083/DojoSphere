export { getCurrentSession } from './supabase/auth/auth'
export { checkOneTimePassword } from './supabase/auth/check-otp'
export { watchAuthState } from './supabase/auth/on-auth-state-change'
export { resendSignUpConfirmationEmail } from './supabase/auth/resend-sign-up-confirmation'
export { signInWithEmailPassword } from './supabase/auth/sign-in-with-email-password'
export { signUpWithMailAndPassword } from './supabase/auth/sign-up-with-mail-and-password'
export {}
export type {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  Session,
  Subscription,
  User
} from './supabase/types/auth-user'
