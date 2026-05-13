import router from '@app/providers/router'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkOneTimePassword } from '../api/check-one-time-password'
import { getRegisterEmailFromStorage } from '../service/register-storage'
import { useSendOneTimePassword } from './use-send-one-time-password'

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

vi.mock('../api/check-one-time-password', () => ({
  checkOneTimePassword: vi.fn()
}))

vi.mock('../service/register-storage', () => ({
  getRegisterEmailFromStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  MONITORING_EVENTS: {
    STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',
    CHECK_OTP_SUBMITTED: 'auth.otp.verify.submitted',
    CHECK_OTP_VALIDATION_FAILED: 'auth.otp.verify.validation.failed',
    CHECK_OTP_REQUEST_STARTED: 'auth.otp.verify.request.started',
    CHECK_OTP_FAILED: 'auth.otp.verify.failed',
    CHECK_OTP_SUCCEEDED: 'auth.otp.verify.succeeded'
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
    const { send } = useSendOneTimePassword()

    const result = await send()

    expect(result).toBe(false)
    expect(checkOneTimePassword).not.toHaveBeenCalled()
  })

  it('uses stored email and returns false when email is initially missing', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    const { send, email, token, success, errorCode, loading } = useSendOneTimePassword()
    token.value = '123456'

    const result = await send()

    expect(result).toBe(false)
    expect(email.value).toBe('stored@mail.com')
    expect(checkOneTimePassword).not.toHaveBeenCalled()
    expect(success.value).toBe(false)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('navigates on successful otp verification', async () => {
    vi.mocked(checkOneTimePassword).mockResolvedValue({ success: true })

    const { send, email, token, success, errorCode, loading } = useSendOneTimePassword()
    email.value = 'existing@mail.com'
    token.value = '123456'

    const result = await send()

    expect(result).toBe(true)
    expect(checkOneTimePassword).toHaveBeenCalledWith('existing@mail.com', '123456')
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

    const { send, email, token, success, errorCode, loading } = useSendOneTimePassword()
    email.value = 'existing@mail.com'
    token.value = '654321'

    const result = await send()

    expect(result).toBe(false)
    expect(checkOneTimePassword).toHaveBeenCalledWith('existing@mail.com', '654321')
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('auth.invalid_otp')
    expect(loading.value).toBe(false)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('falls back to empty email and returns false when storage has no value', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    const { send, token, email } = useSendOneTimePassword()
    token.value = '999000'

    const result = await send()

    expect(result).toBe(false)
    expect(email.value).toBe('')
    expect(checkOneTimePassword).not.toHaveBeenCalled()
  })
})
