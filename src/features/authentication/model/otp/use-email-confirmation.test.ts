import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRegisterEmailFromStorage } from '../register/register-storage'
import { useResend } from './resend/use-resend'
import { useOtp } from './sending/use-otp'
import { useEmailConfirmation } from './use-email-confirmation'

// Mocks
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn()
}))

vi.mock('./sending/use-otp', () => ({
  useOtp: vi.fn()
}))

vi.mock('./resend/use-resend', () => ({
  useResend: vi.fn()
}))

vi.mock('../register/register-storage', () => ({
  getRegisterEmailFromStorage: vi.fn()
}))

describe('useEmailConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should compute email from route.query.email when present', () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: 'route@mail.com' }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    const execute = vi.fn()
    const otpError = ref<string | null>(null)
    vi.mocked(useOtp).mockReturnValue({
      execute,
      errorCode: otpError,
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { email } = useEmailConfirmation()

    expect(email.value).toBe('route@mail.com')
  })

  it('should fall back to stored email when route.query.email is missing', () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { email } = useEmailConfirmation()

    expect(email.value).toBe('stored@mail.com')
  })

  it('should pick first email when route.query.email is an array', () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: ['a@mail.com', 'b@mail.com'] }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { email } = useEmailConfirmation()

    expect(email.value).toBe('a@mail.com')
  })

  it('should return empty string when route.query.email is an empty array', () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: [] }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { email } = useEmailConfirmation()

    expect(email.value).toBe('')
  })

  it('should navigate to settings when verifyOtp succeeds', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: 'route@mail.com' }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    const execute = vi.fn().mockResolvedValue(true)
    vi.mocked(useOtp).mockReturnValue({
      execute,
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { otp, verifyOtp } = useEmailConfirmation()
    otp.value = '123456'

    await verifyOtp()

    expect(execute).toHaveBeenCalledWith('route@mail.com', '123456')
    expect(push).toHaveBeenCalledWith({ name: 'settings' })
  })

  it('should not navigate when verifyOtp fails', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: 'route@mail.com' }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    const execute = vi.fn().mockResolvedValue(false)
    vi.mocked(useOtp).mockReturnValue({
      execute,
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { otp, verifyOtp } = useEmailConfirmation()
    otp.value = '123456'

    await verifyOtp()

    expect(push).not.toHaveBeenCalled()
  })

  it('should resend when resendConfirmation is triggered', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: 'route@mail.com' }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    const resend = vi.fn().mockResolvedValue(true)
    vi.mocked(useResend).mockReturnValue({
      resend,
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resend).toHaveBeenCalledWith('route@mail.com')
  })

  it('should not resend when route.query.email is an empty string', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: { email: '' }
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    const resend = vi.fn()
    vi.mocked(useResend).mockReturnValue({
      resend,
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resend).not.toHaveBeenCalled()
  })

  it('should call execute with stored email when route.query.email is missing', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    const execute = vi.fn().mockResolvedValue(true)
    vi.mocked(useOtp).mockReturnValue({
      execute,
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    vi.mocked(useResend).mockReturnValue({
      resend: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { otp, verifyOtp } = useEmailConfirmation()
    otp.value = '123456'

    await verifyOtp()

    expect(execute).toHaveBeenCalledWith('stored@mail.com', '123456')
    expect(push).toHaveBeenCalledWith({ name: 'settings' })
  })

  it('should resend using stored email when route.query.email is missing', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue('stored@mail.com')

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    const resend = vi.fn().mockResolvedValue(true)
    vi.mocked(useResend).mockReturnValue({
      resend,
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resend).toHaveBeenCalledWith('stored@mail.com')
  })

  it('should not resend when email is empty', async () => {
    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as unknown as ReturnType<typeof useRoute>)

    vi.mocked(getRegisterEmailFromStorage).mockReturnValue(null)

    vi.mocked(useOtp).mockReturnValue({
      execute: vi.fn(),
      errorCode: ref<string | null>(null),
      loading: ref(false)
    } as unknown as ReturnType<typeof useOtp>)

    const resend = vi.fn()
    vi.mocked(useResend).mockReturnValue({
      resend,
      errorCode: ref<string | null>(null),
      loading: ref(false),
      success: ref(false)
    } as unknown as ReturnType<typeof useResend>)

    const { resendConfirmation } = useEmailConfirmation()

    await resendConfirmation()

    expect(resend).not.toHaveBeenCalled()
  })
})
