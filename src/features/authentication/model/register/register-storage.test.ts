import { getStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import {
  getIsOtpActiveFromStorage,
  getRegisterEmailFromStorage,
  setIsOtpActiveToStorage,
  setRegisterEmailToStorage
} from './register-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../../monitoring/monitoring', () => ({
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes otp state to storage and logs event', () => {
    const isActive = true

    setIsOtpActiveToStorage(isActive)

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_OTP_READ, {
      isActive
    })
    expect(setStorageItem).toHaveBeenCalledWith(OTPKEY, isActive)
  })

  it('writes registration email to storage and logs event', () => {
    const email = 'test@test.com'

    setRegisterEmailToStorage(email)

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_READ, {
      email
    })
    expect(setStorageItem).toHaveBeenCalledWith(EMAILKEY, email)
  })

  it('reads otp state from storage and logs event', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    const result = getIsOtpActiveFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_OTP_WRITE, { OTPKEY })
    expect(getStorageItem).toHaveBeenCalledWith(OTPKEY)
    expect(result).toBe(true)
  })

  it('reads registration email from storage and logs event', () => {
    vi.mocked(getStorageItem).mockReturnValue('test@test.com')

    const result = getRegisterEmailFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith(
      MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_WRITE,
      { EMAILKEY }
    )
    expect(getStorageItem).toHaveBeenCalledWith(EMAILKEY)
    expect(result).toBe('test@test.com')
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getIsOtpActiveFromStorage()

    expect(result).toBeNull()
  })
})
