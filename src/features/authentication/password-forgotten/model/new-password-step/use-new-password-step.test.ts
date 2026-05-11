import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setNewPassword } from '../../service/new-password-step/set-new-password'
import { useNewPasswordStep } from './use-new-password-step'

vi.mock('../../service/new-password-step/set-new-password')

describe('useNewPasswordStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true and marks step as valid on success', async () => {
    vi.mocked(setNewPassword).mockResolvedValue({ success: true })

    const newPasswordStep = useNewPasswordStep()
    newPasswordStep.password.value = 'new-password'
    newPasswordStep.error.value = 'old_error'

    const result = await newPasswordStep.execute()

    expect(result).toBe(true)
    expect(setNewPassword).toHaveBeenCalledWith('new-password')
    expect(newPasswordStep.loading.value).toBe(false)
    expect(newPasswordStep.error.value).toBeNull()
    expect(newPasswordStep.isValid.value).toBe(true)
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

    const newPasswordStep = useNewPasswordStep()
    newPasswordStep.password.value = 'bad'

    const result = await newPasswordStep.execute()

    expect(result).toBe(false)
    expect(setNewPassword).toHaveBeenCalledWith('bad')
    expect(newPasswordStep.loading.value).toBe(false)
    expect(newPasswordStep.error.value).toBe('auth.password.invalid')
    expect(newPasswordStep.isValid.value).toBe(false)
  })

  it('returns false when already loading', async () => {
    const newPasswordStep = useNewPasswordStep()
    newPasswordStep.password.value = 'new-password'
    newPasswordStep.loading.value = true

    const result = await newPasswordStep.execute()

    expect(result).toBe(false)
    expect(setNewPassword).not.toHaveBeenCalled()
  })

  it('resets loading when api call throws', async () => {
    vi.mocked(setNewPassword).mockRejectedValue(new Error('network'))

    const newPasswordStep = useNewPasswordStep()
    newPasswordStep.password.value = 'new-password'
    newPasswordStep.isValid.value = true

    await expect(newPasswordStep.execute()).rejects.toThrow('network')
    expect(newPasswordStep.loading.value).toBe(false)
    expect(newPasswordStep.isValid.value).toBe(false)
  })

  it('uses empty string fallback when password is null', async () => {
    vi.mocked(setNewPassword).mockResolvedValue({ success: true })

    const newPasswordStep = useNewPasswordStep()
    const passwordRef = newPasswordStep.password as { value: string | null }
    passwordRef.value = null

    const result = await newPasswordStep.execute()

    expect(result).toBe(true)
    expect(setNewPassword).toHaveBeenCalledWith('')
    expect(newPasswordStep.isValid.value).toBe(true)
  })

  it('allows manually clearing error state', () => {
    const newPasswordStep = useNewPasswordStep()
    newPasswordStep.error.value = 'auth.error'

    newPasswordStep.clearError()
    expect(newPasswordStep.error.value).toBeNull()
  })
})
