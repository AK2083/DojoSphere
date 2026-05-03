import { signUpWithMailAndPassword } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  setIsOtpActiveToStorage,
  setRegisterEmailToStorage
} from '../../model/register-storage'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { registerUserAccount, useRegister } from './use-register'

vi.mock('@shared/auth', () => ({
  signUpWithMailAndPassword: vi.fn()
}))

vi.mock('../../model/register-storage', () => ({
  setIsOtpActiveToStorage: vi.fn(),
  setRegisterEmailToStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  MONITORING_EVENTS: {
    AUTH_REGISTER_SUBMITTED: 'AUTH_REGISTER_SUBMITTED'
  },
  monitorInformation: vi.fn()
}))

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets loading and returns false with error code on failure', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.email_exists',
        name: 'AuthError',
        message: 'Email already exists'
      }
    })

    const { execute, loading, errorCode } = useRegister()

    const result = await execute('user@mail.com', 'pw123456')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('auth.email_exists')
    expect(setIsOtpActiveToStorage).not.toHaveBeenCalled()
    expect(setRegisterEmailToStorage).not.toHaveBeenCalled()
  })

  it('stores otp/email and clears previous errors on success', async () => {
    vi.mocked(signUpWithMailAndPassword)
      .mockResolvedValueOnce({
        success: false,
        error: {
          code: 'auth.temporary_error',
          name: 'AuthError',
          message: 'Temporary issue'
        }
      })
      .mockResolvedValueOnce({ success: true })

    const { execute, loading, errorCode } = useRegister()

    await execute('user@mail.com', 'pw123456')
    expect(errorCode.value).toBe('auth.temporary_error')

    const promise = execute('user@mail.com', 'pw123456')
    expect(loading.value).toBe(true)

    const result = await promise

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBeNull()
    expect(setIsOtpActiveToStorage).toHaveBeenCalledWith(true)
    expect(setRegisterEmailToStorage).toHaveBeenCalledWith('user@mail.com')
  })
})

describe('registerUserAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tracks monitoring and delegates sign-up call', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({ success: true })

    const result = await registerUserAccount('track@mail.com', 'pw123456')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
    expect(signUpWithMailAndPassword).toHaveBeenCalledWith('track@mail.com', 'pw123456')
    expect(result).toEqual({ success: true })
  })
})
