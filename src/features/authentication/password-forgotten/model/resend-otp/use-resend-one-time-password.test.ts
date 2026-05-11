import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { signInWithOneTimePassword } from '../../service/sign-in-with-otp'
import { resendOtp, useResendOneTimePassword } from './use-resend-one-time-password'

vi.mock('../../service/sign-in-with-otp', () => ({
  signInWithOneTimePassword: vi.fn()
}))

vi.mock('../../monitoring/monitoring', () => ({
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

  it('returns false when email is empty', async () => {
    const { resend } = useResendOneTimePassword()

    const result = await resend()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns false when already loading', async () => {
    const { resend, email, loading } = useResendOneTimePassword()
    email.value = 'user@mail.com'
    loading.value = true

    const result = await resend()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns true and clears errors when resend succeeds', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({ success: true })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()
    email.value = 'user@mail.com'
    errorCode.value = 'old_error'

    const result = await resend()

    expect(result).toBe(true)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('user@mail.com')
    expect(success.value).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('stores error code and returns false when resend fails', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.rate_limited',
        name: 'AuthError',
        message: 'Rate limited'
      }
    })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()
    email.value = 'user@mail.com'

    const result = await resend()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('user@mail.com')
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('auth.rate_limited')
    expect(loading.value).toBe(false)
  })

  it('resets loading when resend throws', async () => {
    vi.mocked(signInWithOneTimePassword).mockRejectedValue(new Error('network'))

    const { resend, email, loading, success } = useResendOneTimePassword()
    email.value = 'user@mail.com'
    success.value = true

    await expect(resend()).rejects.toThrow('network')
    expect(loading.value).toBe(false)
    expect(success.value).toBe(false)
  })
})

describe('resendOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tracks monitoring and delegates to signInWithOneTimePassword', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({ success: true })

    const result = await resendOtp('track@mail.com')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.RESEND_OTP)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('track@mail.com')
    expect(result).toEqual({ success: true })
  })
})
