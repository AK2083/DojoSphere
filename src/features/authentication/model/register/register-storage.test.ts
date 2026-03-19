import { getStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { getIsOtpActiveFromStorage, setIsOtpActiveToStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    STORAGE_OTP_READ: 'auth.otp.storage.read',
    STORAGE_OTP_WRITE: 'auth.otp.storage.write'
  }
}))

describe('otp-storage (unit)', () => {
  const OTPKEY = 'dojosphere.auth.register.otpActive'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes otp state to storage and logs event', () => {
    const isActive = true

    setIsOtpActiveToStorage(isActive)

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_OTP_READ, {
      isActive
    })
    expect(setStorageItem).toHaveBeenCalledWith(OTPKEY, JSON.stringify(isActive))
  })

  it('reads otp state from storage and logs event', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    const result = getIsOtpActiveFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_OTP_WRITE, { OTPKEY })
    expect(getStorageItem).toHaveBeenCalledWith(OTPKEY)
    expect(result).toBe(true)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getIsOtpActiveFromStorage()

    expect(result).toBeNull()
  })
})
