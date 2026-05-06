import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmailStepForm } from './use-form'

const executeMock = vi.fn()
const email = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

vi.mock('@shared/lib', () => ({
  emailRules: [(value: unknown) => Boolean(value)],
  mapRule: (rule: (value: unknown) => boolean) => rule,
  useTranslation: () => ({ t: (key: string) => key })
}))

vi.mock('./use-email-step', () => ({
  useEmailStep: () => ({
    email,
    error,
    loading,
    execute: executeMock
  })
}))

describe('useEmailStepForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    email.value = ''
    error.value = null
    loading.value = false
  })

  function createForm() {
    const loadingModel = ref(true)
    const onSuccess = vi.fn()
    const form = useEmailStepForm({ loadingModel, onSuccess })

    return { form, loadingModel, onSuccess }
  }

  it('syncs loading model immediately', () => {
    const { loadingModel } = createForm()

    expect(loadingModel.value).toBe(false)
  })

  it('syncs loading model when loading changes', async () => {
    const { loadingModel } = createForm()

    loading.value = true
    await nextTick()
    expect(loadingModel.value).toBe(true)

    loading.value = false
    await nextTick()
    expect(loadingModel.value).toBe(false)
  })

  it('returns false when form ref is missing', async () => {
    const { form } = createForm()
    email.value = 'test@example.com'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when form validation fails', async () => {
    const { form } = createForm()
    email.value = 'test@example.com'
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: false }) })

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when execution fails', async () => {
    executeMock.mockResolvedValue(false)
    const { form, onSuccess } = createForm()
    email.value = 'failed@example.com'
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: true }) })

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('returns true and emits success with submitted email', async () => {
    executeMock.mockResolvedValue(true)
    const { form, onSuccess } = createForm()
    email.value = 'success@example.com'
    form.setFormRef({ validate: vi.fn().mockResolvedValue({ valid: true }) })

    const result = await form.submit()

    expect(result).toBe(true)
    expect(executeMock).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledWith('success@example.com')
  })
})
