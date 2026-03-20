import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resendOtp } from './resend-otp'
import { useResend } from './use-resend'

// Mocks
vi.mock('./resend-otp', () => ({
  resendOtp: vi.fn()
}))

describe('useResend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { errorCode, loading, success } = useResend()

    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(success.value).toBe(false)
  })

  it('should resend OTP successfully', async () => {
    vi.mocked(resendOtp).mockResolvedValue({
      success: true
    } as RegisterResult)

    const { resend, errorCode, loading, success } = useResend()

    const result = await resend('test@mail.com')

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(success.value).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(resendOtp).toHaveBeenCalledWith('test@mail.com')
  })

  it('should set errorCode and return false when resend fails', async () => {
    vi.mocked(resendOtp).mockResolvedValue({
      success: false,
      error: {
        code: 'INVALID_OTP'
      }
    } as RegisterResult)

    const { resend, errorCode, loading, success } = useResend()

    const result = await resend('test@mail.com')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('INVALID_OTP')
  })

  it('should set loading correctly during execution', async () => {
    vi.mocked(resendOtp).mockResolvedValue({
      success: true
    } as RegisterResult)

    const { resend, loading } = useResend()

    const promise = resend('test@mail.com')
    expect(loading.value).toBe(true)

    const result = await promise

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
  })
})
