import { getStorageItem, removeStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearIsOtpActiveFromStorage, getIsOtpActiveFromStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  removeStorageItem: vi.fn()
}))

describe('otp-storage (unit)', () => {
  const OTPKEY = 'dojosphere.auth.register.otpActive'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads otp state from storage', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    const result = getIsOtpActiveFromStorage()

    expect(getStorageItem).toHaveBeenCalledWith(OTPKEY)
    expect(result).toBe(true)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getIsOtpActiveFromStorage()

    expect(result).toBeNull()
  })

  it('clears otp state from storage', () => {
    clearIsOtpActiveFromStorage()

    expect(removeStorageItem).toHaveBeenCalledWith(OTPKEY)
    expect(removeStorageItem).toHaveBeenCalledTimes(1)
  })
})
