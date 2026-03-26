import { signInWithEmailPassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { loginUserAccount } from './login-user-account'

vi.mock('@shared/api', () => ({
  signInWithEmailPassword: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    AUTH_LOGIN_SUBMITTED: 'AUTH_LOGIN_SUBMITTED'
  }
}))

describe('loginUserAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls monitoring event before sign-in', async () => {
    vi.mocked(signInWithEmailPassword).mockResolvedValue({
      success: true
    } as RegisterResult)

    await loginUserAccount('test@mail.com', 'password123')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_LOGIN_SUBMITTED)
  })

  it('calls signInWithEmailPassword with correct params', async () => {
    vi.mocked(signInWithEmailPassword).mockResolvedValue({
      success: true
    } as RegisterResult)

    await loginUserAccount('user@test.com', 'securePassword')

    expect(signInWithEmailPassword).toHaveBeenCalledWith('user@test.com', 'securePassword')
  })

  it('returns the result from signInWithEmailPassword', async () => {
    const mockResult = { success: true }
    vi.mocked(signInWithEmailPassword).mockResolvedValue(mockResult as RegisterResult)

    const result = await loginUserAccount('a@b.com', '123456')

    expect(result).toEqual(mockResult)
  })

  it('propagates errors from API call', async () => {
    const error = new Error('API failed')
    vi.mocked(signInWithEmailPassword).mockRejectedValue(error)

    await expect(loginUserAccount('fail@test.com', 'badpass')).rejects.toThrow('API failed')
  })

  it('still triggers monitoring even if API fails', async () => {
    vi.mocked(signInWithEmailPassword).mockRejectedValue(new Error())

    try {
      await loginUserAccount('x@y.com', '123')
    } catch {}

    expect(monitorInformation).toHaveBeenCalledTimes(1)
  })
})
