import { checkOneTimePasswordByRecovery } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useVerifyOtpByRecovery } from './use-recovery-otp-step'

vi.mock('@shared/auth')

describe('useVerifyOtpByRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits with empty fallback values when email and token are null', async () => {
    vi.mocked(checkOneTimePasswordByRecovery).mockResolvedValue({ success: true })

    const { submit, loading, error, isValid } = useVerifyOtpByRecovery()

    const result = await submit()

    expect(result).toBe(true)
    expect(checkOneTimePasswordByRecovery).toHaveBeenCalledWith('', '')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(isValid.value).toBe(true)
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

    const { submit, email, token, error, loading, isValid } = useVerifyOtpByRecovery()
    email.value = 'test@example.com'
    token.value = '123456'

    const result = await submit()

    expect(result).toBe(false)
    expect(checkOneTimePasswordByRecovery).toHaveBeenCalledWith('test@example.com', '123456')
    expect(error.value).toBe('auth.invalid_otp')
    expect(loading.value).toBe(false)
    expect(isValid.value).toBe(false)
  })

  it('returns false when already loading', async () => {
    const { submit, loading, email, token } = useVerifyOtpByRecovery()
    email.value = 'test@example.com'
    token.value = '123456'
    loading.value = true

    const result = await submit()

    expect(result).toBe(false)
    expect(checkOneTimePasswordByRecovery).not.toHaveBeenCalled()
  })

  it('resets loading when verification throws', async () => {
    vi.mocked(checkOneTimePasswordByRecovery).mockRejectedValue(new Error('network'))

    const { submit, loading, email, token, isValid } = useVerifyOtpByRecovery()
    email.value = 'test@example.com'
    token.value = '123456'
    isValid.value = true

    await expect(submit()).rejects.toThrow('network')
    expect(loading.value).toBe(false)
    expect(isValid.value).toBe(false)
  })
})
