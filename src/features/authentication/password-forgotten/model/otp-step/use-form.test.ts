import { nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOtpStepForm } from './use-form'

const executeMock = vi.fn()
const email = ref('')
const token = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

vi.mock('./use-otp-step', () => ({
  useOtpStep: () => ({
    email,
    token,
    error,
    loading,
    execute: executeMock
  })
}))

describe('useOtpStepForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    email.value = ''
    token.value = ''
    error.value = null
    loading.value = false
  })

  function createForm() {
    const emailModel = ref('initial@example.com')
    const validModel = ref(false)
    const loadingModel = ref(true)
    const onSuccess = vi.fn()
    const form = useOtpStepForm({ emailModel, validModel, loadingModel, onSuccess })

    return { form, emailModel, validModel, loadingModel, onSuccess }
  }

  it('syncs email from model immediately', () => {
    createForm()
    expect(email.value).toBe('initial@example.com')
  })

  it('syncs email when model changes', async () => {
    const { emailModel } = createForm()

    emailModel.value = 'next@example.com'
    await nextTick()

    expect(email.value).toBe('next@example.com')
  })

  it('syncs valid model from token length', async () => {
    const { validModel } = createForm()

    token.value = '1234'
    await nextTick()
    expect(validModel.value).toBe(false)

    token.value = '123456'
    await nextTick()
    expect(validModel.value).toBe(true)
  })

  it('syncs loading model immediately and on updates', async () => {
    const { loadingModel } = createForm()

    expect(loadingModel.value).toBe(false)

    loading.value = true
    await nextTick()
    expect(loadingModel.value).toBe(true)
  })

  it('returns false when token length is not 6', async () => {
    const { form } = createForm()
    token.value = '12345'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns false when execute fails', async () => {
    executeMock.mockResolvedValue(false)
    const { form, onSuccess } = createForm()
    token.value = '123456'

    const result = await form.submit()

    expect(result).toBe(false)
    expect(executeMock).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('returns true and emits submitted token', async () => {
    executeMock.mockResolvedValue(true)
    const { form, onSuccess } = createForm()
    token.value = '123456'

    const result = await form.submit()

    expect(result).toBe(true)
    expect(executeMock).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledWith('123456')
  })
})
