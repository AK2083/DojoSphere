import router from '@app/providers/router'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { checkOneTimePassword } from '../service/check-one-time-password'
import { getRegisterEmailFromStorage } from './register-storage'
import { useSendOneTimePassword, verifyOtp } from './use-send-one-time-password'

let onMountedHandler: (() => Promise<void>) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => Promise<void>) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('@app/providers/router', () => ({
  default: {
    push: vi.fn()
  }
}))

vi.mock('@features/authentication/service/get-current-session', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('../service/check-one-time-password', () => ({
  checkOneTimePassword: vi.fn()
}))

vi.mock('./register-storage', () => ({
  getRegisterEmailFromStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  MONITORING_EVENTS: {
    CHECK_OTP: 'CHECK_OTP'
  },
  monitorInformation: vi.fn()
}))

describe('useSendOneTimePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedHandler = undefined
  })

  it('sets email from current session on mount', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { email: 'session@mail.com' }
    } as never)

    const { email } = useSendOneTimePassword()

    await onMountedHandler?.()

    expect(email.value).toBe('session@mail.com')
  })

  it('falls back to empty email when session has no user email', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    const { email } = useSendOneTimePassword()

    await onMountedHandler?.()

    expect(email.value).toBe('')
  })

  it('returns false when token is empty', async () => {
    const { execute } = useSendOneTimePassword()

    const result = await execute()

    expect(result).toBe(false)
    expect(checkOneTimePassword).not.toHaveBeenCalled()
  })

  it('uses stored email and navigates on success', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    const { execute, email, token, success, errorCode, loading } = useSendOneTimePassword()
    token.value = '123456'

    const result = await execute()

    expect(result).toBe(true)
    expect(email.value).toBe('stored@mail.com')
    expect(checkOneTimePassword).toHaveBeenCalledWith('stored@mail.com', '123456')
    expect(success.value).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(router.push).toHaveBeenCalledWith({ name: 'settings' })
  })

  it('stores error code and does not navigate on failure', async () => {
    vi.mocked(checkOneTimePassword).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.invalid_otp',
        name: 'AuthError',
        message: 'Invalid otp'
      }
    })

    const { execute, email, token, success, errorCode, loading } = useSendOneTimePassword()
    email.value = 'existing@mail.com'
    token.value = '654321'

    const result = await execute()

    expect(result).toBe(false)
    expect(checkOneTimePassword).toHaveBeenCalledWith('existing@mail.com', '654321')
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('auth.invalid_otp')
    expect(loading.value).toBe(false)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('falls back to empty email when storage has no value', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    const { execute, token, email } = useSendOneTimePassword()
    token.value = '999000'

    const result = await execute()

    expect(result).toBe(true)
    expect(email.value).toBe('')
    expect(checkOneTimePassword).toHaveBeenCalledWith('', '999000')
  })
})

describe('verifyOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tracks monitoring and delegates otp check', async () => {
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    const result = await verifyOtp('test@mail.com', '111222')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.CHECK_OTP)
    expect(checkOneTimePassword).toHaveBeenCalledWith('test@mail.com', '111222')
    expect(result).toEqual({ success: true })
  })
})
