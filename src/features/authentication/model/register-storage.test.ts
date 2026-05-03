import { addBreadcrumb, getStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import {
  setIsOtpActiveToStorage,
  setRegisterEmailToStorage
} from '../register-user/model/register-storage'
import { getIsOtpActiveFromStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  addBreadcrumb: vi.fn(),
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    STORAGE_OTP_READ: 'auth.otp.storage.read',
    STORAGE_OTP_WRITE: 'auth.otp.storage.write',
    STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',
    STORAGE_REGISTER_EMAIL_WRITE: 'auth.register.email.storage.write'
  }
}))

describe('otp-storage (unit)', () => {
  const OTPKEY = 'dojosphere.auth.register.otpActive'
  const EMAILKEY = 'dojosphere.auth.register.email'
  const REGISTER_USER_CATEGORY = 'authentication.registerUser'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes otp state to storage and logs event', () => {
    const isActive = true

    setIsOtpActiveToStorage(isActive)

    expect(addBreadcrumb).toHaveBeenCalledWith(
      MONITORING_EVENTS.STORAGE_OTP_READ,
      REGISTER_USER_CATEGORY,
      'info',
      { isActive }
    )
    expect(setStorageItem).toHaveBeenCalledWith(OTPKEY, isActive)
  })

  it('writes registration email to storage and logs event', () => {
    const email = 'test@test.com'

    setRegisterEmailToStorage(email)

    expect(addBreadcrumb).toHaveBeenCalledWith(
      MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_READ,
      REGISTER_USER_CATEGORY,
      'info',
      { email }
    )
    expect(setStorageItem).toHaveBeenCalledWith(EMAILKEY, email)
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
