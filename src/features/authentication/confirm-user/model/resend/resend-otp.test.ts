import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resendOtp } from './resend-otp'

vi.mock('@shared/api', () => ({
  resendSignUpConfirmationEmail: vi.fn()
}))

vi.mock('../../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    RESEND_OTP: 'RESEND_OTP'
  }
}))

import { resendSignUpConfirmationEmail } from '@shared/api'
import type { RegisterResult } from '@shared/types'

describe('resendOtp', () => {
  const email = 'test@example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls resendSignUpConfirmationEmail with correct email', async () => {
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({ success: true })

    await resendOtp(email)

    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith(email)
  })

  it('returns the result from resendSignUpConfirmationEmail', async () => {
    const mockResult: RegisterResult = { success: true }

    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue(mockResult)

    const result = await resendOtp(email)

    expect(result).toEqual(mockResult)
  })

  it('throws if resendSignUpConfirmationEmail fails', async () => {
    const error = new Error('API error')

    vi.mocked(resendSignUpConfirmationEmail).mockRejectedValue(error)

    await expect(resendOtp(email)).rejects.toThrow('API error')
  })
})
