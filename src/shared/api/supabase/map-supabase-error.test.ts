import type { AuthError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import { AppError } from '../../errors/app-error'
import { mapSupabaseError } from './map-supabase-error'

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
    expect(result.code).toBe('shared.error.unknown')
    expect(result.message).toBe('Original supabase message')
  })

  it('maps over_request_rate_limit to retry error', () => {
    const error = createAuthError('over_request_rate_limit')

    const result = mapSupabaseError(error)

    expect(result).toBeInstanceOf(AppError)
    expect(result.code).toBe('shared.error.retry')
    expect(result.message).toBe('')
  })

  it('maps otp_expired to auth.otp.errorExpired', () => {
    const error = createAuthError('otp_expired')

    const result = mapSupabaseError(error)

    expect(result.code).toBe('auth.otp.errorExpired')
  })

  it('maps flow_state_expired to auth.otp.errorExpired', () => {
    const error = createAuthError('flow_state_expired')

    const result = mapSupabaseError(error)

    expect(result.code).toBe('auth.otp.errorExpired')
  })

  it('maps invalid_otp to auth.otp.errorInvalid', () => {
    const error = createAuthError('invalid_otp')

    const result = mapSupabaseError(error)

    expect(result.code).toBe('auth.otp.errorInvalid')
  })
})
