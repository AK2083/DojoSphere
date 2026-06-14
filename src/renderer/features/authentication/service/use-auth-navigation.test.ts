import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getIsOtpActiveFromStorage } from './register-storage'
import { useAuthNavigation } from './use-auth-navigation'

vi.mock('./register-storage', () => ({
  getIsOtpActiveFromStorage: vi.fn()
}))

describe('useAuthNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return emailverification route when OTP is active', () => {
    vi.mocked(getIsOtpActiveFromStorage).mockReturnValue(true)

    const { getAccountRoute } = useAuthNavigation()

    const result = getAccountRoute()

    expect(result).toEqual({ name: 'emailverification' })
    expect(getIsOtpActiveFromStorage).toHaveBeenCalledTimes(1)
  })

  it('should return register route when OTP is NOT active', () => {
    vi.mocked(getIsOtpActiveFromStorage).mockReturnValue(false)

    const { getAccountRoute } = useAuthNavigation()

    const result = getAccountRoute()

    expect(result).toEqual({ name: 'register' })
    expect(getIsOtpActiveFromStorage).toHaveBeenCalledTimes(1)
  })
})
