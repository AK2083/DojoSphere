import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resendSignUpConfirmationEmail } from '../api/resend-sign-up-confirmation'
import { getRegisterEmailFromStorage } from '../service/register-storage'
import { useResendOneTimePassword } from './use-resend-one-time-password'

let onMountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('../api/resend-sign-up-confirmation', () => ({
  resendSignUpConfirmationEmail: vi.fn()
}))

vi.mock('../service/register-storage', () => ({
  getRegisterEmailFromStorage: vi.fn()
}))

describe('useResendOneTimePassword', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    vi.clearAllMocks()
  })

  it('loads stored email on mount', () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    const { email } = useResendOneTimePassword()
    onMountedHandler?.()

    expect(email.value).toBe('stored@mail.com')
  })

  it('computes canResend based on trimmed email', () => {
    const { canResend, email } = useResendOneTimePassword()

    expect(canResend.value).toBe(false)
    email.value = '   '
    expect(canResend.value).toBe(false)
    email.value = 'user@mail.com'
    expect(canResend.value).toBe(true)
  })

  it('uses stored email and returns false when email is initially missing', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()

    const result = await resend()

    expect(result).toBe(false)
    expect(email.value).toBe('stored@mail.com')
    expect(resendSignUpConfirmationEmail).not.toHaveBeenCalled()
    expect(success.value).toBe(false)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('returns true when resend succeeds with an existing email', async () => {
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({ success: true })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()
    email.value = 'existing@mail.com'

    const result = await resend()

    expect(result).toBe(true)
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('existing@mail.com')
    expect(success.value).toBe(true)
    expect(errorCode.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('stores error code and returns false when resend fails', async () => {
    vi.mocked(resendSignUpConfirmationEmail).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.rate_limited',
        name: 'AuthError',
        message: 'Rate limited'
      }
    })

    const { resend, email, success, errorCode, loading } = useResendOneTimePassword()
    email.value = 'existing@mail.com'

    const result = await resend()

    expect(result).toBe(false)
    expect(resendSignUpConfirmationEmail).toHaveBeenCalledWith('existing@mail.com')
    expect(success.value).toBe(false)
    expect(errorCode.value).toBe('auth.rate_limited')
    expect(loading.value).toBe(false)
  })

  it('falls back to empty email and returns false when storage has no value', async () => {
    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    const { resend, email } = useResendOneTimePassword()

    const result = await resend()

    expect(result).toBe(false)
    expect(email.value).toBe('')
    expect(resendSignUpConfirmationEmail).not.toHaveBeenCalled()
  })
})
