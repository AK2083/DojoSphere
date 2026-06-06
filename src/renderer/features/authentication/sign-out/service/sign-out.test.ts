import { mapSupabaseError, signOut } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException, clearUserContext } from '@shared/lib'
import type { AuthError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearRegisterStorage } from '../../register-user/service/register-storage'
import { signOutUser } from './sign-out'

vi.mock('@shared/api', () => ({
  signOut: vi.fn(),
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn(),
  clearUserContext: vi.fn()
}))

vi.mock('../../register-user/service/register-storage', () => ({
  clearRegisterStorage: vi.fn()
}))

describe('signOutUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears contexts and storage on successful sign out', async () => {
    vi.mocked(signOut).mockResolvedValue({
      error: null
    })

    const result = await signOutUser()

    expect(result).toEqual({ success: true })
    expect(clearUserContext).toHaveBeenCalledTimes(1)
    expect(clearRegisterStorage).toHaveBeenCalledTimes(1)
    expect(captureException).not.toHaveBeenCalled()
  })

  it('returns mapped retry error without capturing exception', async () => {
    const mappedError = new AppError('shared.error.retry')

    vi.mocked(signOut).mockResolvedValue({
      error: {
        message: 'Failed to fetch',
        code: 'network_error'
      } as AuthError
    })
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signOutUser()

    expect(result).toEqual({ success: false, error: mappedError })
    expect(captureException).not.toHaveBeenCalled()
    expect(clearUserContext).not.toHaveBeenCalled()
    expect(clearRegisterStorage).not.toHaveBeenCalled()
  })

  it('captures unexpected mapped errors', async () => {
    const mappedError = new AppError('shared.error.unknown')

    vi.mocked(signOut).mockResolvedValue({
      error: {
        message: 'Auth subsystem unavailable',
        code: 'unexpected_failure'
      } as AuthError
    })
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signOutUser()

    expect(result).toEqual({ success: false, error: mappedError })
    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signOutUser')
    expect(clearUserContext).not.toHaveBeenCalled()
    expect(clearRegisterStorage).not.toHaveBeenCalled()
  })
})
