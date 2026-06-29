import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewPasswordStepForm } from './use-form'

const executeMock = vi.fn()
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

vi.mock('@shared/lib', () => ({
  passwordRules: [(value: unknown) => Boolean(value)],
  mapRule: (rule: (value: unknown) => boolean) => rule,
  useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('./use-new-password-step', () => ({
  useNewPasswordStep: () => ({
    password,
    error,
    loading,
    execute: executeMock
  })
}))

describe('useNewPasswordStepForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    password.value = ''
    error.value = null
    loading.value = false
  })

  function createForm() {
    const validModel = ref(true)
    const loadingModel = ref(true)
    const form = useNewPasswordStepForm({ validModel, loadingModel })

    return { form, validModel, loadingModel }
  }

  it('syncs models immediately', () => {
    const { validModel, loadingModel } = createForm()

    expect(validModel.value).toBe(false)
    expect(loadingModel.value).toBe(false)
  })

  it('syncs loading model when loading changes', async () => {
    const { loadingModel } = createForm()

    loading.value = true
    await nextTick()
    expect(loadingModel.value).toBe(true)
  })

  it('updates valid model when form becomes valid and passwords match', async () => {
    const { form, validModel } = createForm()

    form.isFormValid.value = true
    password.value = 'new-password'
    form.repeatedPassword.value = 'new-password'
    await nextTick()

    expect(validModel.value).toBe(true)
  })

  it('applies repeat-password mismatch rule', () => {
    const { form } = createForm()
    password.value = 'new-password'

    const rules = form.repeatPasswordRules.value
    const mismatchRule = rules[rules.length - 1] as (value: string) => true | string

    expect(mismatchRule('different-password')).toBe(
      'auth.passwordForgotten.steps.newPassword.error.mismatch'
    )
    expect(mismatchRule('new-password')).toBe(true)
  })

  it('returns false when form ref is missing', async () => {
    const { form } = createForm()

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when form validation fails', async () => {
    const { form } = createForm()
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: false }) })
    password.value = 'new-password'
    form.repeatedPassword.value = 'new-password'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when passwords do not match', async () => {
    const { form } = createForm()
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: true }) })
    password.value = 'new-password'
    form.repeatedPassword.value = 'different-password'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when execute fails', async () => {
    executeMock.mockResolvedValue(false)
    const { form } = createForm()
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: true }) })
    password.value = 'new-password'
    form.repeatedPassword.value = 'new-password'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).toHaveBeenCalled()
  })

  it('returns true when execute succeeds', async () => {
    executeMock.mockResolvedValue(true)
    const { form } = createForm()
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: true }) })
    password.value = 'new-password'
    form.repeatedPassword.value = 'new-password'

    const result = await form.submit()

    expect(result).toBe(true)
    expect(executeMock).toHaveBeenCalled()
  })
})
