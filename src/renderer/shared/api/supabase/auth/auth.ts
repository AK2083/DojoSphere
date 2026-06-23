import { captureException } from '@shared/lib'

import { supabase } from '../client'
import { createSupabaseUnreachableAuthError, isSupabaseRequestAllowed } from '../connectivity-guard'
import type { AuthChangeEvent, AuthResponse, Session, UserResponse } from '../types/auth-user'

function blockedAuthResponse(): AuthResponse {
  return {
    data: { user: null, session: null },
    error: createSupabaseUnreachableAuthError()
  }
}

/**
 * Initiates the sign-in process using a one-time password (OTP) sent to the user's email.
 *
 * This function is a low-level wrapper around Supabase's `auth.signInWithOtp` method.
 * It does not perform any error handling, mapping, or side effects.
 * @param email - The email address of the user to sign in.
 * @returns A promise that resolves to an AuthResponse.
 */
export async function signInWithOtp(email: string): Promise<AuthResponse> {
  if (!isSupabaseRequestAllowed()) {
    return blockedAuthResponse()
  }

  return await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false
    }
  })
}

/**
 * Triggers the password-recovery email flow.
 *
 * This low-level wrapper uses Supabase `auth.resetPasswordForEmail`.
 * It does not perform mapping, logging, or side effects.
 *
 * @param email - The email address of the user requesting password recovery.
 * @returns Raw Supabase password recovery response.
 */
export async function requestPasswordRecovery(
  email: string
): Promise<Awaited<ReturnType<typeof supabase.auth.resetPasswordForEmail>>> {
  if (!isSupabaseRequestAllowed()) {
    return { data: null, error: createSupabaseUnreachableAuthError() }
  }

  return await supabase.auth.resetPasswordForEmail(email)
}

/**
 * Retrieves the current authenticated user.
 *
 * This function is a low-level wrapper around Supabase's `auth.getUser` method.
 * It performs no error handling or mapping and returns the raw user data or null.
 *
 * @returns The current authenticated user or null if no user is logged in or an error occurs.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  if (!isSupabaseRequestAllowed()) {
    return { data: { user: null }, error: createSupabaseUnreachableAuthError() }
  }

  return await supabase.auth.getUser()
}

/**
 * Retrieves the current session once.
 * This is used for one-time checks like route guards.
 * @returns The current session or null if no session exists or an error occurred.
 */
export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseRequestAllowed()) {
    return null
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      captureException(error, 'auth', 'getCurrentSession')
      return null
    }

    return data.session
  } catch (error) {
    captureException(error as Error, 'auth', 'getCurrentSession')
    return null
  }
}

/**
 * Subscribes to auth state changes (sign in, sign out, token refresh, etc.).
 * * This is a low-level wrapper around Supabase's `onAuthStateChange`.
 * It allows higher-level layers to react to authentication events
 * without directly depending on the Supabase client.
 *
 * @param callback - A function that is invoked whenever an auth event occurs.
 * @returns A subscription object containing an `unsubscribe` method to clean up the listener.
 *
 * @example
 * const { unsubscribe } = onAuthStateChange((event, session) => {
 * console.log('Auth event:', event, 'New session:', session)
 * })
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange(callback)
  return data.subscription
}

/**
 * Registers a new user using Supabase email/password authentication.
 *
 * This is a low-level API wrapper around Supabase's `auth.signUp` method.
 * It performs no error handling, mapping, or side effects.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the new account.
 *
 * @returns {Promise<AuthResponse>} The raw Supabase authentication response,
 * including `data` and `error`.
 *
 * @example
 * ```ts
 * const { data, error } = await signUpByEmailPassword('test@mail.com', 'secret')
 * ```
 *
 * @remarks
 * This function is intended for use in higher-level layers (e.g. features or entities),
 * where error handling, logging, and domain mapping should be implemented.
 */
export async function signUpByEmailPassword(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!isSupabaseRequestAllowed()) {
    return blockedAuthResponse()
  }

  return supabase.auth.signUp({ email, password })
}

/**
 * Signs in an existing user using Supabase email/password authentication.
 *
 * Low-level wrapper around `auth.signInWithPassword` with no error mapping.
 *
 * @param email - User email address
 * @param password - User password
 * @returns Raw Supabase authentication response
 */
export async function signInByEmailPassword(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!isSupabaseRequestAllowed()) {
    return blockedAuthResponse()
  }

  return supabase.auth.signInWithPassword({ email, password })
}

/**
 * Signs out the current user session from Supabase auth.
 *
 * This is a low-level API wrapper around Supabase's `auth.signOut` method.
 * It does not perform error handling, mapping, or side effects.
 *
 * @returns Raw Supabase sign-out response.
 */
export async function signOut(): Promise<Awaited<ReturnType<typeof supabase.auth.signOut>>> {
  if (!isSupabaseRequestAllowed()) {
    return { error: createSupabaseUnreachableAuthError() }
  }

  return await supabase.auth.signOut()
}

/**
 * Verifies a one-time password (OTP) for email-based sign-up using Supabase.
 *
 * This function wraps Supabase's `auth.verifyOtp` method and confirms a user's
 * email address during the sign-up flow. It performs no error handling or
 * side effects and returns the raw Supabase response.
 *
 * @param {string} email - The email address associated with the OTP.
 * @param {string} token - The one-time password (OTP) sent to the user's email.
 *
 * @returns {Promise<AuthResponse>} The raw authentication response from Supabase,
 * containing `data` (user/session) and `error`.
 *
 * @example
 * ```ts
 * const { data, error } = await checkOtp('test@mail.com', '123456')
 * ```
 *
 * @remarks
 * This is a low-level API function intended to be used in higher-level layers
 * (e.g. features or entities), where error handling, logging, and domain-specific
 * logic should be implemented.
 */
export async function verifyOneTimePasswordBySignUp(
  email: string,
  token: string
): Promise<AuthResponse> {
  if (!isSupabaseRequestAllowed()) {
    return blockedAuthResponse()
  }

  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })
}

/**
 * Verifies a one-time password (OTP) for password recovery.
 *
 * This wraps Supabase's `auth.verifyOtp` with type 'recovery'.
 * No error handling or side effects.
 * @param email - The email address associated with the OTP.
 * @param token - The one-time password sent to the user's email for recovery.
 * @returns The raw Supabase authentication response.
 */
export async function verifyOneTimePasswordByRecovery(
  email: string,
  token: string
): Promise<AuthResponse> {
  if (!isSupabaseRequestAllowed()) {
    return blockedAuthResponse()
  }

  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery'
  })
}

/**
 * Resends the email confirmation link for a sign-up flow.
 *
 * This is a low-level API wrapper around Supabase's `auth.resend` method.
 * It performs no error handling and returns the raw Supabase response.
 *
 * @param {string} email - The email address that should receive a new confirmation link.
 * @returns {Promise<Awaited<ReturnType<typeof supabase.auth.resend>>>} The raw Supabase resend response.
 */
export async function resendSignUpConfirmation(
  email: string
): Promise<Awaited<ReturnType<typeof supabase.auth.resend>>> {
  if (!isSupabaseRequestAllowed()) {
    return {
      data: { user: null, session: null },
      error: createSupabaseUnreachableAuthError()
    }
  }

  return await supabase.auth.resend({
    type: 'signup',
    email
  })
}

/**
 * Updates the user's password.
 *
 * This function is a low-level wrapper around Supabase's `auth.updateUser` method,
 * specifically for updating the password. It does not perform any error handling,
 * mapping, or side effects.
 * @param newPassword - The new password to set for the user.
 * @returns A promise that resolves to the raw Supabase response from `updateUser`.
 */
export async function updateUserPassword(
  newPassword: string
): Promise<Awaited<ReturnType<typeof supabase.auth.updateUser>>> {
  if (!isSupabaseRequestAllowed()) {
    return { data: { user: null }, error: createSupabaseUnreachableAuthError() }
  }

  return await supabase.auth.updateUser({ password: newPassword })
}
