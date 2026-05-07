import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signInWithOneTimePassword } from '../sign-in-with-otp'
import { useEmailStep } from './use-email-step'

vi.mock('../sign-in-with-otp', () => ({
  signInWithOneTimePassword: vi.fn()
}))

describe('useEmailStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns false when email is empty', async () => {
    const emailStep = useEmailStep()

    const result = await emailStep.execute()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns false when submit is triggered while loading', async () => {
    const emailStep = useEmailStep()
    emailStep.email.value = 'test@example.com'
    emailStep.loading.value = true

    const result = await emailStep.execute()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns true and clears old error when submit succeeds', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({ success: true })
    const emailStep = useEmailStep()
    emailStep.email.value = 'test@example.com'
    emailStep.error.value = 'old error'

    const result = await emailStep.execute()

    expect(result).toBe(true)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('test@example.com')
    expect(emailStep.error.value).toBeNull()
    expect(emailStep.loading.value).toBe(false)
  })

  it('stores error message and returns false when submit fails', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.invalid_credentials',
        message: 'Invalid credentials'
      }
    })
    const emailStep = useEmailStep()
    emailStep.email.value = 'test@example.com'

    const result = await emailStep.execute()

    expect(result).toBe(false)
    expect(emailStep.error.value).toBe('Invalid credentials')
    expect(emailStep.loading.value).toBe(false)
  })

  it('returns false when email has only whitespace', async () => {
    const emailStep = useEmailStep()
    emailStep.email.value = '   '

    const result = await emailStep.execute()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('resets loading and rethrows when auth request throws', async () => {
    vi.mocked(signInWithOneTimePassword).mockRejectedValue(new Error('network'))
    const emailStep = useEmailStep()
    emailStep.email.value = 'test@example.com'

    await expect(emailStep.execute()).rejects.toThrow('network')
    expect(emailStep.loading.value).toBe(false)
  })

  it('allows manually clearing errors', () => {
    const emailStep = useEmailStep()
    emailStep.error.value = 'auth.error'

    emailStep.clearError()

    expect(emailStep.error.value).toBeNull()
  })

  it('keeps single in-flight request when execute is called twice', async () => {
    let resolveRequest: (value: { success: true }) => void = () => undefined
    const requestPromise = new Promise<{ success: true }>((resolve) => {
      resolveRequest = resolve
    })
    vi.mocked(signInWithOneTimePassword).mockReturnValue(requestPromise)

    const emailStep = useEmailStep()
    emailStep.email.value = 'test@example.com'

    const firstExecution = emailStep.execute()
    expect(emailStep.loading.value).toBe(true)

    const secondResult = await emailStep.execute()
    expect(secondResult).toBe(false)
    expect(signInWithOneTimePassword).toHaveBeenCalledTimes(1)

    resolveRequest({ success: true })
    await firstExecution

    expect(emailStep.loading.value).toBe(false)
  })
})
