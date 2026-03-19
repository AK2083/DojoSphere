import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getIsOtpActiveFromStorage } from './register/register-storage'
import { useAuthNavigation } from './use-auth-navigation'

vi.mock('./register/register-storage', () => ({
  getIsOtpActiveFromStorage: vi.fn()
}))

describe('useAuthNavigation (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns home route when OTP is active', () => {
    vi.mocked(getIsOtpActiveFromStorage).mockReturnValue(true)

    const { getAccountRoute } = useAuthNavigation()

    const result = getAccountRoute()

    expect(getIsOtpActiveFromStorage).toHaveBeenCalled()
    expect(result).toEqual({ name: 'home' })
  })

  it('returns emailConfirmation route when OTP is not active', () => {
    vi.mocked(getIsOtpActiveFromStorage).mockReturnValue(false)

    const { getAccountRoute } = useAuthNavigation()

    const result = getAccountRoute()

    expect(getIsOtpActiveFromStorage).toHaveBeenCalled()
    expect(result).toEqual({ name: 'emailConfirmation' })
  })

  it('returns emailConfirmation when storage returns null', () => {
    vi.mocked(getIsOtpActiveFromStorage).mockReturnValue(null)

    const { getAccountRoute } = useAuthNavigation()

    const result = getAccountRoute()

    expect(result).toEqual({ name: 'emailConfirmation' })
  })
})
