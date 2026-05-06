import { setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  setStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    STORAGE_OTP_READ: 'auth.otp.storage.read',
    STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read'
  }
}))

describe('register-user register-storage (unit)', () => {
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
})
