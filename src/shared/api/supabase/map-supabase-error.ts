import type { AuthError } from '@supabase/supabase-js'

import { AppError } from '../../errors/app-error'
import { translationKeys } from '../../lib/i18n/keys'

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
    case 'user_already_exists':
      return new AppError('auth.email_exists')

    case 'invalid_credentials':
      return new AppError('auth.invalid_credentials')

    case 'over_request_rate_limit':
      return new AppError(translationKeys.error.retry)

    default:
      return new AppError(translationKeys.error.unknown, error.message)
  }
}
