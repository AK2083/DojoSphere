import { mapSupabaseError } from '@shared/api/supabase/map-supabase-error'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib/glitchtip/logging'
import { AuthError, type AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { verifyOneTimePassword } from './auth'
import { checkOneTimePassword } from './check-otp'

vi.mock('./auth', () => ({
  verifyOneTimePassword: vi.fn()
}))

vi.mock('@shared/api/supabase/map-supabase-error', () => ({
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib/glitchtip/logging', () => ({
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

    const mappedError = new AppError('auth.invalid_otp')

    vi.mocked(verifyOneTimePassword).mockResolvedValue(response)
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

    vi.mocked(verifyOneTimePassword).mockResolvedValue(response)

    const result = await checkOneTimePassword(email, token)

    expect(result).toEqual({
      success: true
    })

    expect(captureException).not.toHaveBeenCalled()
    expect(mapSupabaseError).not.toHaveBeenCalled()
  })
})
