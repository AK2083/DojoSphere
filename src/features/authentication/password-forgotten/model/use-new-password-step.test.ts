import { setNewPassword } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewPasswordStep } from './use-new-password-step'

vi.mock('@shared/auth')

describe('useNewPasswordStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true and marks step as valid on success', async () => {
    vi.mocked(setNewPassword).mockResolvedValue({ success: true })

    const { submit, password, loading, error, isValid } = useNewPasswordStep()
    password.value = 'new-password'
    error.value = 'old_error'

    const result = await submit()

    expect(result).toBe(true)
    expect(setNewPassword).toHaveBeenCalledWith('new-password')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(isValid.value).toBe(true)
  })

  it('returns false and stores error code on failure', async () => {
    vi.mocked(setNewPassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.password.invalid',
        message: 'Invalid password'
      }
    })

    const { submit, password, loading, error, isValid } = useNewPasswordStep()
    password.value = 'bad'

    const result = await submit()

    expect(result).toBe(false)
    expect(setNewPassword).toHaveBeenCalledWith('bad')
    expect(loading.value).toBe(false)
    expect(error.value).toBe('auth.password.invalid')
    expect(isValid.value).toBe(false)
  })

  it('returns false when already loading', async () => {
    const { submit, loading, password } = useNewPasswordStep()
    password.value = 'new-password'
    loading.value = true

    const result = await submit()

    expect(result).toBe(false)
    expect(setNewPassword).not.toHaveBeenCalled()
  })

  it('resets loading when api call throws', async () => {
    vi.mocked(setNewPassword).mockRejectedValue(new Error('network'))

    const { submit, loading, password, isValid } = useNewPasswordStep()
    password.value = 'new-password'
    isValid.value = true

    await expect(submit()).rejects.toThrow('network')
    expect(loading.value).toBe(false)
    expect(isValid.value).toBe(false)
  })

  it('uses empty string fallback when password is null', async () => {
    vi.mocked(setNewPassword).mockResolvedValue({ success: true })

    const { submit, isValid, password } = useNewPasswordStep()
    const passwordRef = password as { value: string | null }
    passwordRef.value = null

    const result = await submit()

    expect(result).toBe(true)
    expect(setNewPassword).toHaveBeenCalledWith('')
    expect(isValid.value).toBe(true)
  })
})
