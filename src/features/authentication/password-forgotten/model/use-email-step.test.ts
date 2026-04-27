import { signInWithOneTimePassword } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmailStep } from './use-email-step'

vi.mock('@shared/auth')

describe('useEmailStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns false when email is not valid', async () => {
    const { submit } = useEmailStep()

    const result = await submit()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns false when already loading', async () => {
    const { submit, loading, isValid } = useEmailStep()
    isValid.value = true
    loading.value = true

    const result = await submit()

    expect(result).toBe(false)
    expect(signInWithOneTimePassword).not.toHaveBeenCalled()
  })

  it('returns true and clears error on successful submit', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({ success: true })

    const { submit, email, isValid, error, loading } = useEmailStep()
    email.value = 'test@example.com'
    error.value = 'old error'
    isValid.value = true

    const result = await submit()

    expect(result).toBe(true)
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('test@example.com')
  })

  it('stores mapped message when submit fails', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.invalid_credentials',
        message: 'Invalid credentials'
      }
    })

    const { submit, email, isValid, error, loading } = useEmailStep()
    email.value = 'test@example.com'
    isValid.value = true

    const result = await submit()

    expect(result).toBe(false)
    expect(error.value).toBe('Invalid credentials')
    expect(loading.value).toBe(false)
  })

  it('resets loading when api call throws', async () => {
    vi.mocked(signInWithOneTimePassword).mockRejectedValue(new Error('network'))

    const { submit, email, isValid, loading } = useEmailStep()
    email.value = 'test@example.com'
    isValid.value = true

    await expect(submit()).rejects.toThrow('network')
    expect(loading.value).toBe(false)
  })

  it('uses empty string fallback when email is null', async () => {
    vi.mocked(signInWithOneTimePassword).mockResolvedValue({ success: true })

    const { submit, isValid } = useEmailStep()
    isValid.value = true

    const result = await submit()

    expect(result).toBe(true)
    expect(signInWithOneTimePassword).toHaveBeenCalledWith('')
  })
})
