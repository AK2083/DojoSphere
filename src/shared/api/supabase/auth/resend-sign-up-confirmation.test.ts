import { captureException } from '@shared/lib'
import type { AuthError, AuthOtpResponse, AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from '../../../errors/app-error'
import { mapSupabaseError } from '../map-supabase-error'
import { resendSignUpConfirmation } from './auth'
import { resendSignUpConfirmationEmail } from './resend-sign-up-confirmation'

vi.mock('./auth', () => ({
  resendSignUpConfirmation: vi.fn()
}))

vi.mock('../map-supabase-error', () => ({
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn()
}))

describe('resendSignUpConfirmationEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns mapped error when supabase resend fails', async () => {
    const authError = {
      name: 'AuthError',
      message: 'Invalid email',
      status: 400,
      code: 'invalid_email'
    } as AuthError

    const mappedError = new AppError('auth.invalid_email', '')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: authError
    }

    vi.mocked(resendSignUpConfirmation).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await resendSignUpConfirmationEmail('test@mail.com')

    expect(captureException).toHaveBeenCalledWith(
      authError,
      'auth',
      'resendSignUpConfirmationEmail'
    )
    expect(mapSupabaseError).toHaveBeenCalledWith(authError)
    expect(result).toEqual({
      success: false,
      error: mappedError
    })
  })

  it('returns success when supabase resend succeeds', async () => {
    const response: AuthOtpResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(resendSignUpConfirmation).mockResolvedValue(response)

    const result = await resendSignUpConfirmationEmail('test@mail.com')

    expect(result).toEqual({ success: true })
    expect(captureException).not.toHaveBeenCalled()
    expect(mapSupabaseError).not.toHaveBeenCalled()
  })
})
