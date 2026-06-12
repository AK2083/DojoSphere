import {
  type AuthError,
  type AuthResponse,
  mapSupabaseError,
  verifyOneTimePasswordByRecovery
} from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkOneTimePasswordByRecovery } from '../api/check-otp-by-recovery'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('checkOneTimePasswordByRecovery', () => {
  const email = 'recovery@test.com'
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
    const mappedError = new AppError('auth.otp.errorInvalid')

    vi.mocked(verifyOneTimePasswordByRecovery).mockResolvedValue({
      data: { user: null, session: null },
      error: authError
    } satisfies AuthResponse)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await checkOneTimePasswordByRecovery(email, token)

    expect(captureException).toHaveBeenCalledWith(
      authError,
      'auth',
      'checkOneTimePasswordByRecovery'
    )
    expect(mapSupabaseError).toHaveBeenCalledWith(authError)
    expect(result).toEqual({ success: false, error: mappedError })
  })

  it('returns success when verification succeeds', async () => {
    vi.mocked(verifyOneTimePasswordByRecovery).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse)

    const result = await checkOneTimePasswordByRecovery(email, token)

    expect(result).toEqual({ success: true })
    expect(captureException).not.toHaveBeenCalled()
    expect(mapSupabaseError).not.toHaveBeenCalled()
  })
})
