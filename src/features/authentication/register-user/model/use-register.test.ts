import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signUpWithMailAndPassword } from '../api/sign-up-with-mail-and-password'
import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from '../service/register-storage'
import { useRegister } from './use-register'

vi.mock('../api/sign-up-with-mail-and-password', () => ({
  signUpWithMailAndPassword: vi.fn()
}))

vi.mock('../service/register-storage', () => ({
  setIsOtpActiveToStorage: vi.fn(),
  setRegisterEmailToStorage: vi.fn()
}))

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets error code and returns false on failed registration', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'shared.error.unknown',
        message: 'Unknown error'
      }
    })

    const { execute, loading, errorCode } = useRegister()

    const result = await execute('user@mail.com', 'pw123456')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('shared.error.unknown')
    expect(setIsOtpActiveToStorage).not.toHaveBeenCalled()
    expect(setRegisterEmailToStorage).not.toHaveBeenCalled()
  })

  it('stores register state and returns true on successful registration', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({ success: true })

    const { execute, loading, errorCode } = useRegister()

    const result = await execute('success@mail.com', 'pw123456')

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBeNull()
    expect(setIsOtpActiveToStorage).toHaveBeenCalledWith(true)
    expect(setRegisterEmailToStorage).toHaveBeenCalledWith('success@mail.com')
  })

  it('returns false when execute is called during loading', async () => {
    let resolveSignUp: (value: { success: true }) => void = () => undefined
    const signUpPromise = new Promise<{ success: true }>((resolve) => {
      resolveSignUp = resolve
    })
    vi.mocked(signUpWithMailAndPassword).mockReturnValue(signUpPromise)

    const { execute, loading } = useRegister()

    const firstExecution = execute('user@mail.com', 'pw123456')
    expect(loading.value).toBe(true)

    const secondResult = await execute('user@mail.com', 'pw123456')
    expect(secondResult).toBe(false)
    expect(signUpWithMailAndPassword).toHaveBeenCalledTimes(1)

    resolveSignUp({ success: true })
    await firstExecution
  })

  it('resets loading state when registration throws', async () => {
    vi.mocked(signUpWithMailAndPassword).mockRejectedValue(new Error('network failure'))

    const { execute, loading } = useRegister()

    await expect(execute('user@mail.com', 'pw123456')).rejects.toThrow('network failure')
    expect(loading.value).toBe(false)
  })

  it('allows manually clearing error state', async () => {
    vi.mocked(signUpWithMailAndPassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'shared.error.unknown',
        message: 'Unknown error'
      }
    })

    const { execute, clearError, errorCode } = useRegister()

    await execute('user@mail.com', 'pw123456')
    expect(errorCode.value).toBe('shared.error.unknown')

    clearError()
    expect(errorCode.value).toBeNull()
  })
})
