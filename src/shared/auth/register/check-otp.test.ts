import {
  type AuthError,
  type AuthResponse,
  mapSupabaseError,
  verifyOneTimePasswordBySignUp
} from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkOneTimePassword } from './check-otp'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('checkOneTimePassword', () => {
  const email = 'test@test.com'
  const token = '123456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns mapped error when verification fails', async () => {
    const authError = {
      name: 'Invalid OTP',
      message: 'Invalid OTP',
      status: 400,
      code: 'invalid_otp'
    } as AuthError

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: authError
    }

    const mappedError = new AppError('auth.otp.errorInvalid')

    vi.mocked(verifyOneTimePasswordBySignUp).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await checkOneTimePassword(email, token)

    expect(captureException).toHaveBeenCalledWith(authError, 'auth', 'checkOneTimePassword')

    expect(mapSupabaseError).toHaveBeenCalledWith(authError)

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
