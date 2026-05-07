import { AppError } from '@shared/errors'
import type { AuthError } from '@supabase/supabase-js'

import translationKeys from '../../lib/i18n/keys'

/**
 * Maps a Supabase authentication error to an application-specific {@link AppError}.
 *
 * The function converts Supabase `AuthError` codes into user-facing
 * application errors that can be handled consistently across the UI.
 * Known error codes are mapped to specific translation keys, while
 * unknown errors fall back to a generic error message.
 *
 * @param {AuthError} error - The Supabase authentication error to map.
 *
 * @returns {AppError} An application-specific error containing a
 * translation key and optional additional details.
 */
export function mapSupabaseError(error: AuthError): AppError {
  switch (error.code) {
    // Sign-up collision
    case 'user_already_exists':
      return new AppError(translationKeys.error.unknown)

    case 'invalid_credentials':
    case 'invalid_login_credentials':
      return new AppError('auth.invalid_credentials')

    // Validation errors for email based auth flows
    case 'invalid_email':
    case 'email_address_invalid':
      return new AppError('auth.invalid_email')

    // Password update and signup constraints
    case 'weak_password':
    case 'same_password':
      return new AppError('auth.weak_password')

    case 'invalid_otp':
      return new AppError('auth.otp.errorInvalid')

    case 'otp_expired':
    case 'flow_state_expired':
    case 'flow_state_not_found':
    case 'expired_token':
      return new AppError('auth.otp.errorExpired')

    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
    case 'over_sms_send_rate_limit':
    case 'request_timeout':
      return new AppError(translationKeys.error.retry)

    default:
      return new AppError(translationKeys.error.unknown, error.message)
  }
}
