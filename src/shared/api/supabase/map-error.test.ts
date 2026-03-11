import { describe, it, expect } from 'vitest'
import { mapSupabaseError } from './map-error'
import { AppError } from '../../errors/app-error'
import type { AuthError } from '@supabase/supabase-js'

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
    expect(result.code).toBe('auth.invalid_credentials')
  })

  it('maps unknown errors to unknown_error and keeps message', () => {
    const error = createAuthError('something_else', 'Original supabase message')

    const result = mapSupabaseError(error)

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('unknown_error')
    expect(result.message).toBe('Original supabase message')
  })
})
