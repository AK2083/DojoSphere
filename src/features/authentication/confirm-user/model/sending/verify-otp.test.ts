import { checkOneTimePassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../../password-forgotten/model/monitoring'
import { verifyOtp } from './verify-otp'

// mocks
vi.mock('../../../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    AUTH_REGISTER_SUBMITTED: 'AUTH_REGISTER_SUBMITTED',
    CHECK_OTP: 'CHECK_OTP'
  }
}))

vi.mock('@shared/api', () => ({
  checkOneTimePassword: vi.fn()
}))

describe('verifyOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call monitoring with correct event', async () => {
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    await verifyOtp('test@mail.com', '123456')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.CHECK_OTP)
  })

  it('should call checkOneTimePassword with correct params', async () => {
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    await verifyOtp('test@mail.com', '123456')

    expect(checkOneTimePassword).toHaveBeenCalledWith('test@mail.com', '123456')
  })

  it('should return the result from checkOneTimePassword', async () => {
    const mockResponse = { success: true }

    vi.mocked(checkOneTimePassword).mockResolvedValue(mockResponse as RegisterResult)

    const result = await verifyOtp('test@mail.com', '123456')

    expect(result).toBe(mockResponse)
  })

  it('should propagate errors from checkOneTimePassword', async () => {
    const error = new Error('Network error')

    vi.mocked(checkOneTimePassword).mockRejectedValue(error)

    await expect(verifyOtp('test@mail.com', '123456')).rejects.toThrow('Network error')
  })
})
