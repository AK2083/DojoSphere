import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signOutUser } from '../service/sign-out'
import { useSignOut } from './use-sign-out'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

vi.mock('../service/sign-out', () => ({
  signOutUser: vi.fn()
}))

describe('useSignOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('navigates to datasource when logout succeeds', async () => {
    vi.mocked(signOutUser).mockResolvedValue({ success: true })
    const { logout, loading, errorCode } = useSignOut()

    const result = await logout()

    expect(result).toBe(true)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBeNull()
    expect(pushMock).toHaveBeenCalledWith({ name: 'datasource' })
  })

  it('stores mapped error code when logout fails', async () => {
    vi.mocked(signOutUser).mockResolvedValue({
      success: false,
      error: { code: 'shared.error.retry', message: 'retry later', name: 'AppError' }
    })

    const { logout, loading, errorCode } = useSignOut()

    const result = await logout()

    expect(result).toBe(false)
    expect(loading.value).toBe(false)
    expect(errorCode.value).toBe('shared.error.retry')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('prevents duplicate logout execution while loading', async () => {
    let resolveSignOut: (value: { success: true }) => void = () => undefined
    const pendingPromise = new Promise<{ success: true }>((resolve) => {
      resolveSignOut = resolve
    })

    vi.mocked(signOutUser).mockReturnValue(pendingPromise)
    const { logout, loading } = useSignOut()

    const firstExecution = logout()
    expect(loading.value).toBe(true)

    const secondResult = await logout()
    expect(secondResult).toBe(false)
    expect(signOutUser).toHaveBeenCalledTimes(1)

    resolveSignOut({ success: true })
    await firstExecution
  })

  it('allows clearing the error state manually', async () => {
    vi.mocked(signOutUser).mockResolvedValue({
      success: false,
      error: { code: 'shared.error.unknown', message: 'unknown', name: 'AppError' }
    })

    const { logout, clearError, errorCode } = useSignOut()

    await logout()
    expect(errorCode.value).toBe('shared.error.unknown')

    clearError()
    expect(errorCode.value).toBeNull()
  })

  it('resets loading state when service throws', async () => {
    vi.mocked(signOutUser).mockRejectedValue(new Error('network failure'))

    const { logout, loading } = useSignOut()

    await expect(logout()).rejects.toThrow('network failure')
    expect(loading.value).toBe(false)
  })
})
