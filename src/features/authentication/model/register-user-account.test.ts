import { signUpWithMailAndPassword } from '@shared/api/supabase/sign-up-with-mail-and-password'
import { AppError } from '@shared/errors/app-error'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { registerUserAccount } from './register-user-account'

vi.mock('@shared/api/supabase/sign-up-with-mail-and-password', () => ({
  signUpWithMailAndPassword: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    AUTH_REGISTER_SUBMITTED: 'AUTH_REGISTER_SUBMITTED'
  }
}))

describe('registerUserAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs monitoring event and registers user successfully', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: true
    })

    const result = await registerUserAccount('test@test.com', 'password')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)

    expect(signUpWithMailAndPassword).toHaveBeenCalledWith('test@test.com', 'password')

    expect(result).toEqual({ success: true })
  })

  it('returns failure if AppError is thrown', async () => {
    const appError = new AppError('auth.error')

    vi.mocked(signUpWithMailAndPassword).mockRejectedValue(appError)

    const result = await registerUserAccount('test@test.com', 'password')

    expect(result).toEqual({
      success: false,
      error: appError
    })
  })

  it('wraps unknown error into AppError', async () => {
    const unknownError = new Error('unexpected')

    vi.mocked(signUpWithMailAndPassword).mockRejectedValue(unknownError)

    const result = await registerUserAccount('test@test.com', 'password')

    expect(result.success).toBe(false)
  })
})
