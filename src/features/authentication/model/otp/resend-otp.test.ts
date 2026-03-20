import { resendSignUpConfirmationEmail } from '@shared/api'
import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { resendOtp } from './resend-otp'

// Mocks
vi.mock('@shared/api', () => ({
  resendSignUpConfirmationEmail: vi.fn()
}))

vi.mock('../../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    RESEND_OTP: 'auth.otp.resend'
  }
}))

describe('resendOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call monitoring with correct event', async () => {
    const executeResult: RegisterResult = { success: true }

    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue(executeResult)

    await resendOtp('test@mail.com')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.RESEND_OTP)
  })

  it('should call resendSignUpConfirmationEmail with correct params', async () => {
    const email = 'test@mail.com'
    const executeResult: RegisterResult = { success: true }

    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue(executeResult)

    await resendOtp(email)

    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith(email)
  })

  it('should return the result from resendSignUpConfirmationEmail', async () => {
    const executeResult: RegisterResult = { success: true }

    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue(executeResult)

    const result = await resendOtp('test@mail.com')

    expect(result).toBe(executeResult)
  })

  it('should propagate errors from resendSignUpConfirmationEmail', async () => {
    const error = new Error('Network error')

    vi.mocked(resendSignUpConfirmationEmail).mockRejectedValue(error)

    await expect(resendOtp('test@mail.com')).rejects.toThrow('Network error')
  })
})
