import { checkOneTimePasswordByRecovery } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOtpStep } from './use-otp-step'

vi.mock('@shared/auth')

describe('useOtpStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits with current email and token', async () => {
    vi.mocked(checkOneTimePasswordByRecovery).mockResolvedValue({ success: true })

    const otpStep = useOtpStep()
    otpStep.email.value = 'test@example.com'
    otpStep.token.value = '123456'

    const result = await otpStep.execute()

    expect(result).toBe(true)
    expect(checkOneTimePasswordByRecovery).toHaveBeenCalledWith('test@example.com', '123456')
    expect(otpStep.loading.value).toBe(false)
    expect(otpStep.error.value).toBeNull()
    expect(otpStep.isValid.value).toBe(true)
  })

  it('sets error code and returns false when verification fails', async () => {
    vi.mocked(checkOneTimePasswordByRecovery).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.invalid_otp',
        message: 'Invalid OTP'
      }
    })

    const otpStep = useOtpStep()
    otpStep.email.value = 'test@example.com'
    otpStep.token.value = '123456'

    const result = await otpStep.execute()

    expect(result).toBe(false)
    expect(otpStep.error.value).toBe('auth.invalid_otp')
    expect(otpStep.loading.value).toBe(false)
    expect(otpStep.isValid.value).toBe(false)
  })

  it('returns false when already loading', async () => {
    const otpStep = useOtpStep()
    otpStep.loading.value = true

    const result = await otpStep.execute()

    expect(result).toBe(false)
    expect(checkOneTimePasswordByRecovery).not.toHaveBeenCalled()
  })

  it('resets loading and validity when verification throws', async () => {
    vi.mocked(checkOneTimePasswordByRecovery).mockRejectedValue(new Error('network'))

    const otpStep = useOtpStep()
    otpStep.email.value = 'test@example.com'
    otpStep.token.value = '123456'
    otpStep.isValid.value = true

    await expect(otpStep.execute()).rejects.toThrow('network')
    expect(otpStep.loading.value).toBe(false)
    expect(otpStep.isValid.value).toBe(false)
  })

  it('allows manually clearing error state', () => {
    const otpStep = useOtpStep()
    otpStep.error.value = 'auth.invalid_otp'

    otpStep.clearError()

    expect(otpStep.error.value).toBeNull()
  })
})
