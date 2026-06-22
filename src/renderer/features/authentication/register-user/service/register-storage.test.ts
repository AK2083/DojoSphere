import { removeStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearRegisterStorage,
  setIsOtpActiveToStorage,
  setRegisterEmailToStorage
} from './register-storage'

vi.mock('@shared/lib', () => ({
  setStorageItem: vi.fn(),
  removeStorageItem: vi.fn()
}))

describe('register-user register-storage (unit)', () => {
  const OTPKEY = 'dojosphere.auth.register.otpActive'
  const EMAILKEY = 'dojosphere.auth.register.email'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes otp state to storage', () => {
    const isActive = true

    setIsOtpActiveToStorage(isActive)

    expect(setStorageItem).toHaveBeenCalledWith(OTPKEY, isActive)
  })

  it('writes registration email to storage', () => {
    const email = 'test@test.com'

    setRegisterEmailToStorage(email)

    expect(setStorageItem).toHaveBeenCalledWith(EMAILKEY, email)
  })

  it('clears register-related storage keys', () => {
    clearRegisterStorage()

    expect(removeStorageItem).toHaveBeenCalledWith(EMAILKEY)
    expect(removeStorageItem).toHaveBeenCalledWith(OTPKEY)
    expect(removeStorageItem).toHaveBeenCalledTimes(2)
  })
})
