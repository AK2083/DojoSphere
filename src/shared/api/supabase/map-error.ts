import { translationKeys } from '@features/authentication/i18n/keys'
import type { AuthError } from '@supabase/supabase-js'

import { AppError } from '../../errors/app-error'

export function mapSupabaseError(error: AuthError): AppError {
  switch (error.code) {
    case 'user_already_exists':
      return new AppError('auth.email_exists')

    case 'over_request_rate_limit':
      return new AppError(translationKeys.form.error.retry)

    default:
      return new AppError(translationKeys.form.error.unknown, error.message)
  }
}
