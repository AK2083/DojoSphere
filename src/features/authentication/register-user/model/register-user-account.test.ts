import { signUpWithMailAndPassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { registerUserAccount } from './register-user-account'

vi.mock('@shared/api', () => ({
  signUpWithMailAndPassword: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    AUTH_REGISTER_SUBMITTED: 'AUTH_REGISTER_SUBMITTED',
    CHECK_OTP: 'CHECK_OTP'
  }
}))

describe('registerUserAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls monitoring event before registering', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: true
    } as RegisterResult)

    await registerUserAccount('test@mail.com', 'password123')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
  })

  it('calls signUpWithMailAndPassword with correct params', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: true
    } as RegisterResult)

    await registerUserAccount('user@test.com', 'securePassword')

    expect(signUpWithMailAndPassword).toHaveBeenCalledWith('user@test.com', 'securePassword')
  })

  it('returns the result from signUpWithMailAndPassword', async () => {
    const mockResult = { success: true }
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue(mockResult as RegisterResult)

    const result = await registerUserAccount('a@b.com', '123456')

    expect(result).toEqual(mockResult)
  })

  it('propagates errors from API call', async () => {
    const error = new Error('API failed')
    vi.mocked(signUpWithMailAndPassword).mockRejectedValue(error)

    await expect(registerUserAccount('fail@test.com', 'badpass')).rejects.toThrow('API failed')
  })

  it('still triggers monitoring even if API fails', async () => {
    vi.mocked(signUpWithMailAndPassword).mockRejectedValue(new Error())

    try {
      await registerUserAccount('x@y.com', '123')
    } catch {}

    expect(monitorInformation).toHaveBeenCalledTimes(1)
  })
})
