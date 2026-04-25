import { mapSupabaseError, verifyOneTimePasswordBySignUp } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import { AuthError, type AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkOneTimePassword } from './check-otp'

vi.mock('@shared/api', () => ({
  verifyOneTimePasswordBySignUp: vi.fn(),
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn()
}))

describe('checkOneTimePassword', () => {
  const email = 'test@test.com'
  const token = '123456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns mapped error when verification fails', async () => {
    const supabaseError = new AuthError('Invalid OTP', 400, 'invalid_otp')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: supabaseError
    }

    const mappedError = new AppError('auth.otp.errorInvalid')

    vi.mocked(verifyOneTimePasswordBySignUp).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await checkOneTimePassword(email, token)

    expect(captureException).toHaveBeenCalledWith(supabaseError, 'auth', 'checkOneTimePassword')

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)

    expect(result).toEqual({
      success: false,
      error: mappedError
    })
  })

  it('returns success when verification succeeds', async () => {
    const response: AuthResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(verifyOneTimePasswordBySignUp).mockResolvedValue(response)

    const result = await checkOneTimePassword(email, token)

    expect(result).toEqual({
      success: true
    })

    expect(captureException).not.toHaveBeenCalled()
    expect(mapSupabaseError).not.toHaveBeenCalled()
  })
})
