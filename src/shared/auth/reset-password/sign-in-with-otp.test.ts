import { type AuthError, type AuthResponse, mapSupabaseError, signInWithOtp } from '@shared/api'
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
    const response = {
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInWithOtp).mockResolvedValue(response)

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

    const response = {
      data: { user: null, session: null },
      error: supabaseError
    } satisfies AuthResponse

    vi.mocked(signInWithOtp).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithOneTimePassword(email)

    expect(result).toMatchObject({ success: false })

    const err = (result as { success: false; error: AppError }).error

    expect(err.code).toBe('otp_failed')
    expect(err.message).toBe('OTP failed')

    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signInWithOneTimePassword')
  })

  it('calls API with correct email', async () => {
    const response = {
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInWithOtp).mockResolvedValue(response)

    await signInWithOneTimePassword(email)

    expect(signInWithOtp).toHaveBeenCalledWith(email)
  })
})
