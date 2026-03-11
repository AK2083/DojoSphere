import { AppError } from '../../errors/app-error'
import type { AuthError } from '@supabase/supabase-js'

export function mapSupabaseError(error: AuthError): AppError {
  switch (error.code) {
    case 'user_already_exists':
      return new AppError('auth.email_exists')

    case 'invalid_credentials':
      return new AppError('auth.invalid_credentials')

    default:
      return new AppError('unknown_error', error.message)
  }
}
