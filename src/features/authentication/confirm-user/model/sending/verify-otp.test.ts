import { checkOneTimePassword } from '@shared/api'
import type { AppError } from '@shared/errors/app-error'
import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { verifyOtp } from './verify-otp'

const { monitorInformationMock, checkOneTimePasswordMock, MONITORING_EVENTS_MOCK } = vi.hoisted(
  () => ({
    monitorInformationMock: vi.fn(),
    checkOneTimePasswordMock: vi.fn(),
    MONITORING_EVENTS_MOCK: {
      CHECK_OTP: 'CHECK_OTP'
    }
  })
)

vi.mock('@shared/api', () => ({
  checkOneTimePassword: checkOneTimePasswordMock
}))

vi.mock('../../monitoring/monitoring', () => ({
  monitorInformation: monitorInformationMock,
  MONITORING_EVENTS: MONITORING_EVENTS_MOCK
}))

describe('verifyOtp', () => {
  const email = 'test@example.com'
  const token = '123456'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls monitoring with CHECK_OTP event', async () => {
    const mockResult: RegisterResult = { success: true }

    vi.mocked(checkOneTimePassword).mockResolvedValue(mockResult)

    await verifyOtp(email, token)

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.CHECK_OTP)
  })

  it('calls checkOneTimePassword with correct params', async () => {
    const mockResult: RegisterResult = { success: true }

    vi.mocked(checkOneTimePassword).mockResolvedValue(mockResult)

    await verifyOtp(email, token)

    expect(checkOneTimePassword).toHaveBeenCalledWith(email, token)
  })

  it('returns success result', async () => {
    const mockResult: RegisterResult = { success: true }

    vi.mocked(checkOneTimePassword).mockResolvedValue(mockResult)

    const result = await verifyOtp(email, token)

    expect(result).toEqual(mockResult)
  })

  it('returns error result (API-level error)', async () => {
    const mockError = { message: 'Invalid OTP' } as AppError

    const mockResult: RegisterResult = {
      success: false,
      error: mockError
    }

    vi.mocked(checkOneTimePassword).mockResolvedValue(mockResult)

    const result = await verifyOtp(email, token)

    expect(result).toEqual(mockResult)
  })

  it('throws if checkOneTimePassword rejects', async () => {
    const error = new Error('Network error')

    vi.mocked(checkOneTimePassword).mockRejectedValue(error)

    await expect(verifyOtp(email, token)).rejects.toThrow('Network error')
  })
})
