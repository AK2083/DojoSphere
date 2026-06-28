import {
  type AuthError,
  type AuthOtpResponse,
  type AuthResponse,
  mapSupabaseError,
  resendSignUpConfirmation
} from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resendSignUpConfirmationEmail } from './resend-sign-up-confirmation'

vi.mock('@shared/api')
vi.mock('@shared/lib', () => ({
  logError: vi.fn()
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

    vi.mocked(resendSignUpConfirmation).mockResolvedValue({
      data: { user: null, session: null },
      error: authError
    } satisfies AuthResponse)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await resendSignUpConfirmationEmail('test@mail.com')

    expect(logError).toHaveBeenCalledWith(mappedError, 'auth', 'resendSignUpConfirmationEmail')
    expect(mapSupabaseError).toHaveBeenCalledWith(authError)
    expect(result).toEqual({ success: false, error: mappedError })
  })

  it('returns success when supabase resend succeeds', async () => {
    vi.mocked(resendSignUpConfirmation).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } satisfies AuthOtpResponse)

    const result = await resendSignUpConfirmationEmail('test@mail.com')

    expect(result).toEqual({ success: true })
    expect(logError).not.toHaveBeenCalled()
    expect(mapSupabaseError).not.toHaveBeenCalled()
  })
})
