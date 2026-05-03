import { resendSignUpConfirmationEmail } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRegisterEmailFromStorage } from '../../model/register-storage'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { resendOtp, useResendOneTimePassword } from './use-resend-one-time-password'

vi.mock('@shared/auth', () => ({
  resendSignUpConfirmationEmail: vi.fn()
}))

vi.mock('../../model/register-storage', () => ({
  getRegisterEmailFromStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  MONITORING_EVENTS: {
    RESEND_OTP: 'RESEND_OTP'
  },
  monitorInformation: vi.fn()
}))

describe('useResendOneTimePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('computes canResend based on trimmed email', () => {
    const { canResend, email } = useResendOneTimePassword()

    expect(canResend.value).toBe(false)
    email.value = '   '
    expect(canResend.value).toBe(false)
    email.value = 'user@mail.com'
    expect(canResend.value).toBe(true)
  })

  it('uses stored email and returns true when resend succeeds', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({ success: true })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()

    const result = await resend()

    expect(result).toBe(true)
    expect(email.value).toBe('stored@mail.com')
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('stored@mail.com')
    expect(success.value).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('stores error code and returns false when resend fails', async () => {
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.rate_limited',
        name: 'AuthError',
        message: 'Rate limited'
      }
    })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()
    email.value = 'existing@mail.com'

    const result = await resend()

    expect(result).toBe(false)
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('existing@mail.com')
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('auth.rate_limited')
    expect(loading.value).toBe(false)
  })

  it('falls back to empty email when storage has no value', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({ success: true })

    const { resend, email } = useResendOneTimePassword()

    const result = await resend()

    expect(result).toBe(true)
    expect(email.value).toBe('')
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('')
  })
})

describe('resendOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tracks monitoring and delegates resend call', async () => {
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({ success: true })

    const result = await resendOtp('track@mail.com')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.RESEND_OTP)
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('track@mail.com')
    expect(result).toEqual({ success: true })
  })
})
