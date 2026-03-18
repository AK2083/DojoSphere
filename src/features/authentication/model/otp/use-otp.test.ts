import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOtp } from './use-otp'
import { verifyOtp } from './verify-otp'

vi.mock('./verify-otp', () => ({
  verifyOtp: vi.fn()
}))

describe('useOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { errorCode, loading } = useOtp()

    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('should handle successful OTP verification', async () => {
    vi.mocked(verifyOtp).mockResolvedValue({
      success: true
    })

    const { execute, errorCode, loading } = useOtp()

    const result = await execute('test@mail.com', '123456')

    expect(result).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(verifyOtp).toHaveBeenCalledWith('test@mail.com', '123456')
  })

  it('should handle failed OTP verification', async () => {
    vi.mocked(verifyOtp).mockResolvedValue({
      success: false,
      error: {
        code: 'INVALID_OTP',
        name: '',
        message: ''
      }
    })

    const { execute, errorCode, loading } = useOtp()

    const result = await execute('test@mail.com', 'wrong')

    expect(result).toBe(false)
    expect(errorCode.value).toBe('INVALID_OTP')
    expect(loading.value).toBe(false)
  })

  it('should set loading correctly during execution', async () => {
    vi.mocked(verifyOtp).mockResolvedValue({
      success: true
    })

    const { execute, loading, errorCode } = useOtp()

    const promise = execute('test@test.com', 'password')

    expect(loading.value).toBe(true)

    const result = await promise

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe(null)
  })
})
