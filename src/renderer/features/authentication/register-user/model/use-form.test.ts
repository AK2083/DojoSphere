import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRegisterForm } from './use-form'

const executeMock = vi.fn()
const clearErrorMock = vi.fn()
const navigateAfterRegisterSuccessMock = vi.fn()

const errorCode = ref<string | null>(null)
const loading = ref(false)
const isOnline = ref(true)

vi.mock('@shared/lib', () => ({
  emailRules: [(value: unknown) => Boolean(value)],
  passwordRules: [(value: unknown) => Boolean(value)],
  mapRule: (rule: (value: unknown) => boolean) => rule,
  useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('@shared/model', () => ({
  useNetworkStatusState: () => ({
    isOnline
  })
}))

vi.mock('./use-register', () => ({
  useRegister: () => ({
    execute: executeMock,
    clearError: clearErrorMock,
    errorCode,
    loading
  })
}))

vi.mock('./use-routing', () => ({
  useRegisterRouting: () => ({
    navigateAfterRegisterSuccess: navigateAfterRegisterSuccessMock
  })
}))

describe('useRegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    errorCode.value = null
    loading.value = false
    isOnline.value = true
  })

  it('stops when form validation fails', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: false })
    const registerForm = useRegisterForm()
    registerForm.setFormRef({ validate: validateMock })

    await registerForm.submit()

    expect(validateMock).toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
    expect(navigateAfterRegisterSuccessMock).not.toHaveBeenCalled()
  })

  it('does not submit when request is already loading', async () => {
    loading.value = true

    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const registerForm = useRegisterForm()
    registerForm.setFormRef({ validate: validateMock })

    await registerForm.submit()

    expect(validateMock).not.toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('keeps submit disabled while loading', () => {
    loading.value = true
    const registerForm = useRegisterForm()

    expect(registerForm.isSubmitDisabled.value).toBe(true)
  })

  it('does not submit when registration is disabled in offline mode', async () => {
    isOnline.value = false
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const registerForm = useRegisterForm()
    registerForm.setFormRef({ validate: validateMock })

    await registerForm.submit()

    expect(validateMock).not.toHaveBeenCalled()
    expect(executeMock).not.toHaveBeenCalled()
    expect(registerForm.registerUnavailableHintCode.value).toBe(
      'auth.registerUser.unavailable.offline'
    )
    expect(registerForm.isRegistrationDisabled.value).toBe(true)
  })

  it('unlocks submit after reconnect when inputs exist', () => {
    isOnline.value = false
    const registerForm = useRegisterForm()
    registerForm.email.value = 'test@mail.com'
    registerForm.password.value = 'pw123456'

    isOnline.value = true

    expect(registerForm.registerUnavailableHintCode.value).toBeNull()
    expect(registerForm.isRegistrationDisabled.value).toBe(false)
    expect(registerForm.isSubmitDisabled.value).toBe(false)
  })

  it('enables submit when form validity turns true', () => {
    const registerForm = useRegisterForm()
    registerForm.isFormValid.value = true

    expect(registerForm.isSubmitDisabled.value).toBe(false)
  })

  it('enables submit when only password is filled', () => {
    const registerForm = useRegisterForm()
    registerForm.password.value = 'pw123456'

    expect(registerForm.isSubmitDisabled.value).toBe(false)
  })

  it('stops when form ref is missing', async () => {
    const registerForm = useRegisterForm()

    await registerForm.submit()

    expect(executeMock).not.toHaveBeenCalled()
    expect(navigateAfterRegisterSuccessMock).not.toHaveBeenCalled()
  })

  it('navigates after successful submit', async () => {
    executeMock.mockResolvedValue(true)
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const registerForm = useRegisterForm()
    registerForm.setFormRef({ validate: validateMock })
    registerForm.email.value = 'success@mail.com'
    registerForm.password.value = 'pw123456'

    await registerForm.submit()

    expect(executeMock).toHaveBeenCalledWith('success@mail.com', 'pw123456')
    expect(navigateAfterRegisterSuccessMock).toHaveBeenCalledWith('success@mail.com')
  })

  it('does not navigate when execute fails', async () => {
    executeMock.mockResolvedValue(false)
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const registerForm = useRegisterForm()
    registerForm.setFormRef({ validate: validateMock })
    registerForm.email.value = 'failed@mail.com'
    registerForm.password.value = 'pw123456'

    await registerForm.submit()

    expect(executeMock).toHaveBeenCalledWith('failed@mail.com', 'pw123456')
    expect(navigateAfterRegisterSuccessMock).not.toHaveBeenCalled()
  })

  it('clears existing error when user changes input', async () => {
    const registerForm = useRegisterForm()
    errorCode.value = 'auth.error'

    registerForm.email.value = 'edited@mail.com'
    await nextTick()

    expect(clearErrorMock).toHaveBeenCalled()
  })

  it('does not clear errors on input change when there is no error', async () => {
    const registerForm = useRegisterForm()

    registerForm.password.value = 'pw123456'
    await nextTick()

    expect(clearErrorMock).not.toHaveBeenCalled()
  })
})
