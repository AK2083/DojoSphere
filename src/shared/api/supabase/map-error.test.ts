import type { AuthError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import { AppError } from '../../errors/app-error'
import { mapSupabaseError } from './map-error'

function createAuthError(code: string, message = 'supabase error'): AuthError {
  return {
    code,
    message,
    status: 400,
    name: 'AuthError'
  } as AuthError
}

describe('mapSupabaseError', () => {
  it('maps user_already_exists to auth.email_exists', () => {
    const error = createAuthError('user_already_exists')

    const result = mapSupabaseError(error)

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('auth.email_exists')
    expect(result.message).toBe('')
  })

  it('maps invalid_credentials to auth.invalid_credentials', () => {
    const error = createAuthError('invalid_credentials')

    const result = mapSupabaseError(error)

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('auth.form.error.unknown')
  })

  it('maps unknown errors to unknown_error and keeps message', () => {
    const error = createAuthError('something_else', 'Original supabase message')

    const result = mapSupabaseError(error)

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('auth.form.error.unknown')
    expect(result.message).toBe('Original supabase message')
  })
})
