import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmailConfirmation } from './use-email-confirmation'

const { useRouteMock, pushMock, getRegisterEmailFromStorageMock } = vi.hoisted(() => ({
  useRouteMock: vi.fn(),
  pushMock: vi.fn(),
  getRegisterEmailFromStorageMock: vi.fn<() => string | null>(() => 'stored@example.com')
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: useRouteMock
}))

const verifyOtpMock = vi.fn()
const otpErrorMock = ref<string | null>(null)

vi.mock('./sending/use-otp', () => ({
  useOtp: () => ({
    execute: verifyOtpMock,
    errorCode: otpErrorMock
  })
}))

const resendMock = vi.fn()
const resendErrorMock = ref<string | null>(null)
const resendLoadingMock = ref(false)
const resendSuccessMock = ref(false)

vi.mock('./resend/use-resend', () => ({
  useResend: () => ({
    resend: resendMock,
    errorCode: resendErrorMock,
    loading: resendLoadingMock,
    success: resendSuccessMock
  })
}))

const storageEmailMock = 'stored@example.com'

vi.mock('../../register-user/model/register-storage', () => ({
  getRegisterEmailFromStorage: getRegisterEmailFromStorageMock
}))

describe('useEmailConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    otpErrorMock.value = null
    resendErrorMock.value = null
    resendSuccessMock.value = false
  })

  it('uses email from route query if available', () => {
    useRouteMock.mockReturnValue({
      query: { email: 'route@example.com' }
    })

    const { email } = useEmailConfirmation()

    expect(email.value).toBe('route@example.com')
  })

  it('falls back to stored email if no query email', () => {
    useRouteMock.mockReturnValue({
      query: { email: 'stored@example.com' }
    })

    const { email } = useEmailConfirmation()

    expect(email.value).toBe(storageEmailMock)
  })

  it('verifyOtpHandler sets isOtpVerified and redirects', async () => {
    verifyOtpMock.mockResolvedValue(true)

    const { verifyOtp, otp, isOtpVerified } = useEmailConfirmation()

    otp.value = '123456'

    await verifyOtp()

    expect(verifyOtpMock).toHaveBeenCalled()
    expect(isOtpVerified.value).toBe(true)
    expect(pushMock).toHaveBeenCalledWith({ name: 'settings' })
  })

  it('resendConfirmation calls resend when email exists', async () => {
    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resendMock).toHaveBeenCalledWith(storageEmailMock)
  })

  it('resendConfirmation does nothing if email is empty', async () => {
    useRouteMock.mockReturnValue({
      query: { email: '' }
    })

    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resendMock).not.toHaveBeenCalled()
  })

  it('alert shows otp error first', () => {
    otpErrorMock.value = 'OTP_ERROR'

    const { alert } = useEmailConfirmation()

    expect(alert.value).toEqual({
      type: 'error',
      text: 'OTP_ERROR'
    })
  })

  it('alert shows resend error if no otp error', () => {
    resendErrorMock.value = 'RESEND_ERROR'

    const { alert } = useEmailConfirmation()

    expect(alert.value).toEqual({
      type: 'error',
      text: 'RESEND_ERROR'
    })
  })

  it('alert shows success when resend succeeds', () => {
    resendSuccessMock.value = true

    const { alert } = useEmailConfirmation()

    expect(alert.value).toEqual({
      type: 'success',
      text: 'auth.otp.resend.success'
    })
  })

  it('alert is null when no state is active', () => {
    const { alert } = useEmailConfirmation()

    expect(alert.value).toBeNull()
  })

  it('uses first element if email query is an array', () => {
    useRouteMock.mockReturnValue({
      query: { email: ['first@test.com', 'second@test.com'] }
    })
    const { email } = useEmailConfirmation()
    expect(email.value).toBe('first@test.com')
  })

  it('returns empty string if email query is an empty array', () => {
    useRouteMock.mockReturnValue({
      query: { email: [] }
    })
    const { email } = useEmailConfirmation()
    expect(email.value).toBe('')
  })

  it('correctly falls back to storage if query is undefined', () => {
    useRouteMock.mockReturnValue({ query: {} })

    const { email } = useEmailConfirmation()
    expect(email.value).toBe(storageEmailMock)
  })

  it('prioritizes otpError over resendErrorCode', () => {
    otpErrorMock.value = 'OTP_FAILED'
    resendErrorMock.value = 'RESEND_FAILED'

    const { alert } = useEmailConfirmation()

    expect(alert.value).toEqual({
      type: 'error',
      text: 'OTP_FAILED'
    })
  })

  it('prioritizes resendErrorCode over resendSuccess', () => {
    resendErrorMock.value = 'RESEND_FAILED'
    resendSuccessMock.value = true

    const { alert } = useEmailConfirmation()

    expect(alert.value).toEqual({
      type: 'error',
      text: 'RESEND_FAILED'
    })
  })

  it('handles empty array in query and returns empty string', () => {
    useRouteMock.mockReturnValue({
      query: { email: [] }
    })
    const { email } = useEmailConfirmation()
    expect(email.value).toBe('')
  })

  it('returns empty string if storage email is also null', () => {
    useRouteMock.mockReturnValue({ query: {} })
    getRegisterEmailFromStorageMock.mockReturnValue(null)

    const { email } = useEmailConfirmation()
    expect(email.value).toBe('')
  })

  it('sets isOtpVerified to false if verification fails', async () => {
    verifyOtpMock.mockResolvedValue(false)
    const { verifyOtp, isOtpVerified } = useEmailConfirmation()

    await verifyOtp()

    expect(isOtpVerified.value).toBe(false)
    expect(pushMock).toHaveBeenCalledWith({ name: 'settings' })
  })

  it('does not call resend if email is undefined/null', async () => {
    useRouteMock.mockReturnValue({ query: { email: undefined } })
    getRegisterEmailFromStorageMock.mockReturnValue(null)

    const { resendConfirmation, email } = useEmailConfirmation()

    expect(email.value).toBe('')

    await resendConfirmation()
    expect(resendMock).not.toHaveBeenCalled()
  })
})
