import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLoginForm } from './use-form'

const executeMock = vi.fn()
const clearErrorMock = vi.fn()
const navigateAfterLoginSuccessMock = vi.fn()
const goToPasswordResetMock = vi.fn()

const errorCode = ref<string | null>(null)
const loading = ref(false)
const isOnline = ref(true)
const isCloudUsed = ref(true)

vi.mock('@shared/lib', () => ({
  addBreadcrumb: vi.fn(),
  emailRules: [(value: unknown) => Boolean(value)],
  passwordRules: [(value: unknown) => Boolean(value)],
  mapRule: (rule: (value: unknown) => boolean) => rule,
  useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('@shared/model', () => ({
  useNetworkStatusState: () => ({
    isOnline,
    isCloudUsed
  })
}))

vi.mock('./use-login', () => ({
  useLogin: () => ({
    execute: executeMock,
    clearError: clearErrorMock,
    errorCode,
    loading
  })
}))

vi.mock('./use-routing', () => ({
  useLoginRouting: () => ({
    navigateAfterLoginSuccess: navigateAfterLoginSuccessMock,
    goToPasswordReset: goToPasswordResetMock
  })
}))

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    errorCode.value = null
    loading.value = false
    isOnline.value = true
    isCloudUsed.value = true
  })

  it('stops when form validation fails', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: false })
    const loginForm = useLoginForm()
    loginForm.setFormRef({ validate: validateMock })

    await loginForm.submit()

    expect(validateMock).toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
    expect(navigateAfterLoginSuccessMock).not.toHaveBeenCalled()
  })

  it('stops when form ref is missing', async () => {
    const loginForm = useLoginForm()

    await loginForm.submit()

    expect(executeMock).not.toHaveBeenCalled()
    expect(navigateAfterLoginSuccessMock).not.toHaveBeenCalled()
  })

  it('does not submit when request is already loading', async () => {
    loading.value = true

    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const loginForm = useLoginForm()
    loginForm.setFormRef({ validate: validateMock })

    await loginForm.submit()

    expect(validateMock).not.toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('does not submit when login is disabled in offline mode', async () => {
    isOnline.value = false
    isCloudUsed.value = true
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const loginForm = useLoginForm()
    loginForm.setFormRef({ validate: validateMock })

    await loginForm.submit()

    expect(validateMock).not.toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
    expect(loginForm.loginUnavailableHintCode.value).toBe('auth.signIn.unavailable.offline')
    expect(loginForm.isLoginDisabled.value).toBe(true)
    expect(loginForm.isSubmitDisabled.value).toBe(true)
  })

  it('prefers cloud hint over offline hint when both are inactive', () => {
    isOnline.value = false
    isCloudUsed.value = false
    const loginForm = useLoginForm()

    expect(loginForm.loginUnavailableHintCode.value).toBe('auth.signIn.unavailable.cloud')
    expect(loginForm.isLoginDisabled.value).toBe(true)
  })

  it('navigates after successful submit', async () => {
    executeMock.mockResolvedValue(true)
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const loginForm = useLoginForm()
    loginForm.setFormRef({ validate: validateMock })
    loginForm.email.value = 'success@mail.com'
    loginForm.password.value = 'pw123456'

    await loginForm.submit()

    expect(executeMock).toHaveBeenCalledWith('success@mail.com', 'pw123456')
    expect(navigateAfterLoginSuccessMock).toHaveBeenCalled()
  })

  it('does not navigate when execute fails', async () => {
    executeMock.mockResolvedValue(false)
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const loginForm = useLoginForm()
    loginForm.setFormRef({ validate: validateMock })
    loginForm.email.value = 'failed@mail.com'
    loginForm.password.value = 'pw123456'

    await loginForm.submit()

    expect(executeMock).toHaveBeenCalledWith('failed@mail.com', 'pw123456')
    expect(navigateAfterLoginSuccessMock).not.toHaveBeenCalled()
  })

  it('clears existing error when user changes input', async () => {
    const loginForm = useLoginForm()
    errorCode.value = 'auth.error'

    loginForm.email.value = 'edited@mail.com'
    await nextTick()

    expect(clearErrorMock).toHaveBeenCalled()
  })

  it('does not clear errors on input change when there is no error', async () => {
    const loginForm = useLoginForm()

    loginForm.password.value = 'pw123456'
    await nextTick()

    expect(clearErrorMock).not.toHaveBeenCalled()
  })

  it('navigates to password reset with current email', async () => {
    const loginForm = useLoginForm()
    loginForm.email.value = 'reset@mail.com'

    await loginForm.navigateToPasswordReset()

    expect(goToPasswordResetMock).toHaveBeenCalledWith('reset@mail.com')
  })

  it('does not navigate to password reset when login is disabled', async () => {
    isOnline.value = false
    isCloudUsed.value = true
    const loginForm = useLoginForm()
    loginForm.email.value = 'reset@mail.com'

    await loginForm.navigateToPasswordReset()

    expect(goToPasswordResetMock).not.toHaveBeenCalled()
  })

  it('unlocks submit after reconnect when inputs exist', () => {
    isOnline.value = false
    isCloudUsed.value = true
    const loginForm = useLoginForm()
    loginForm.email.value = 'test@mail.com'
    loginForm.password.value = 'pw123456'

    isOnline.value = true

    expect(loginForm.loginUnavailableHintCode.value).toBeNull()
    expect(loginForm.isLoginDisabled.value).toBe(false)
    expect(loginForm.isSubmitDisabled.value).toBe(false)
  })
})
