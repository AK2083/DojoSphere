import type { RegisterResult } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { registerUserAccount } from './register-user-account'
import { useRegister } from './use-register'

vi.mock('./register-user-account', () => ({
  registerUserAccount: vi.fn()
}))

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets loading during execution and returns true on success', async () => {
    vi.mocked(registerUserAccount).mockResolvedValue({
      success: true
    })

    const { execute, loading, errorCode } = useRegister()

    const promise = execute('test@test.com', 'password')

    // loading sollte direkt true sein
    expect(loading.value).toBe(true)

    const result = await promise

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe(null)
  })

  it('sets errorCode and returns false on failure', async () => {
    vi.mocked(registerUserAccount).mockResolvedValue({
      success: false,
      error: {
        code: 'auth.error'
      }
    } as RegisterResult)

    const { execute, errorCode, loading } = useRegister()

    const result = await execute('test@test.com', 'password')

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('auth.error')
  })

  it('resets previous error on success', async () => {
    vi.mocked(registerUserAccount)
      .mockResolvedValueOnce({
        success: false,
        error: { code: 'auth.error' }
      } as RegisterResult)
      .mockResolvedValueOnce({
        success: true
      })

    const { execute, errorCode } = useRegister()

    await execute('test@test.com', 'password')
    expect(errorCode.value).toBe('auth.error')

    await execute('test@test.com', 'password')
    expect(errorCode.value).toBe(null)
  })
})
