import { type AuthError, mapSupabaseError, requestPasswordRecovery } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signInWithOneTimePassword } from './sign-in-with-otp'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('signInWithOneTimePassword', () => {
  const email = 'test@example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when OTP request succeeds', async () => {
    vi.mocked(requestPasswordRecovery).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } as never)

    const result = await signInWithOneTimePassword(email)

    expect(result).toEqual({ success: true })
    expect(captureException).not.toHaveBeenCalled()
  })

  it('maps supabase error and returns AppError', async () => {
    const supabaseError = {
      message: 'OTP failed',
      status: 400,
      code: 'otp_failed',
      name: 'AuthError'
    } as AuthError
    const mappedError = new AppError('otp_failed', 'OTP failed')

    vi.mocked(requestPasswordRecovery).mockResolvedValue({
      data: { user: null, session: null },
      error: supabaseError
    } as never)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithOneTimePassword(email)

    expect(result).toEqual({ success: false, error: mappedError })
    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signInWithOneTimePassword')
  })

  it('calls API with correct email', async () => {
    vi.mocked(requestPasswordRecovery).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } as never)

    await signInWithOneTimePassword(email)

    expect(requestPasswordRecovery).toHaveBeenCalledWith(email)
  })
})
