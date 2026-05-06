import { signInWithEmailPassword } from '@shared/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { loginUserAccount, useLogin } from './use-login'

vi.mock('@shared/auth', () => ({
  signInWithEmailPassword: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  MONITORING_EVENTS: {
    AUTH_LOGIN_SUBMITTED: 'AUTH_LOGIN_SUBMITTED'
  },
  monitorInformation: vi.fn()
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets error code and returns false on failed login', async () => {
    vi.mocked(signInWithEmailPassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.invalid_credentials',
        message: 'Invalid credentials'
      }
    })

    const { execute, loading, errorCode } = useLogin()

    const result = await execute('user@mail.com', 'wrong-password')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('auth.invalid_credentials')
  })

  it('returns true and clears previous errors on successful login', async () => {
    let resolveSignIn: (value: { success: true }) => void = () => undefined

    const signInPromise = new Promise<{ success: true }>((resolve) => {
      resolveSignIn = resolve
    })

    vi.mocked(signInWithEmailPassword)
      .mockResolvedValueOnce({
        success: false,
        error: {
          name: 'AuthError',
          code: 'auth.temporary_error',
          message: 'Temporary issue'
        }
      })
      .mockReturnValueOnce(signInPromise)

    const { execute, loading, errorCode } = useLogin()

    await execute('user@mail.com', 'pw123456')
    expect(errorCode.value).toBe('auth.temporary_error')

    const pendingExecution = execute('user@mail.com', 'pw123456')
    expect(loading.value).toBe(true)

    resolveSignIn({ success: true })
    const result = await pendingExecution

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBeNull()
  })

  it('returns false when execute is called during loading', async () => {
    let resolveSignIn: (value: { success: true }) => void = () => undefined
    const signInPromise = new Promise<{ success: true }>((resolve) => {
      resolveSignIn = resolve
    })
    vi.mocked(signInWithEmailPassword).mockReturnValue(signInPromise)

    const { execute, loading } = useLogin()

    const firstExecution = execute('user@mail.com', 'pw123456')
    expect(loading.value).toBe(true)

    const secondResult = await execute('user@mail.com', 'pw123456')
    expect(secondResult).toBe(false)
    expect(signInWithEmailPassword).toHaveBeenCalledTimes(1)

    resolveSignIn({ success: true })
    await firstExecution
  })

  it('resets loading state when sign-in throws', async () => {
    vi.mocked(signInWithEmailPassword).mockRejectedValue(new Error('network failure'))

    const { execute, loading } = useLogin()

    await expect(execute('user@mail.com', 'pw123456')).rejects.toThrow('network failure')
    expect(loading.value).toBe(false)
  })

  it('allows manually clearing error state', async () => {
    vi.mocked(signInWithEmailPassword).mockResolvedValue({
      success: false,
      error: {
        name: 'AuthError',
        code: 'auth.invalid_credentials',
        message: 'Invalid credentials'
      }
    })

    const { execute, clearError, errorCode } = useLogin()

    await execute('user@mail.com', 'wrong-password')
    expect(errorCode.value).toBe('auth.invalid_credentials')

    clearError()
    expect(errorCode.value).toBeNull()
  })
})

describe('loginUserAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tracks monitoring and delegates auth sign-in', async () => {
    vi.mocked(signInWithEmailPassword).mockResolvedValue({ success: true })

    const result = await loginUserAccount('track@mail.com', 'pw123456')

    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.AUTH_LOGIN_SUBMITTED)
    expect(signInWithEmailPassword).toHaveBeenCalledWith('track@mail.com', 'pw123456')
    expect(result).toEqual({ success: true })
  })
})
