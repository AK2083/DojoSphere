import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loginUserAccount } from './login-user-account'
import { useLogin } from './use-login'

vi.mock('./login-user-account', () => ({
  loginUserAccount: vi.fn()
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets loading during execution and returns true on success', async () => {
    vi.mocked(loginUserAccount).mockResolvedValue({
      success: true
    })

    const { execute, loading, errorCode } = useLogin()

    const promise = execute('test@test.com', 'password')

    expect(loading.value).toBe(true)

    const result = await promise

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe(null)
  })

  it('sets errorCode and returns false on failure', async () => {
    vi.mocked(loginUserAccount).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.invalid_credentials'
      }
    } as RegisterResult)

    const { execute, errorCode, loading } = useLogin()

    const result = await execute('test@test.com', 'password')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('auth.invalid_credentials')
  })

  it('resets previous error on success', async () => {
    vi.mocked(loginUserAccount)
      .mockResolvedValueOnce({
        success: false,
        error: { code: 'auth.invalid_credentials' }
      } as RegisterResult)
      .mockResolvedValueOnce({
        success: true
      })

    const { execute, errorCode } = useLogin()

    await execute('test@test.com', 'password')
    expect(errorCode.value).toBe('auth.invalid_credentials')

    await execute('test@test.com', 'password')
    expect(errorCode.value).toBe(null)
  })
})
