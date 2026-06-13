import { getCurrentSession, mapSupabaseError, signOut } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException, clearUserContext } from '@shared/lib'
import type { AuthError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearRegisterStorage } from '../../register-user/service/register-storage'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { revokeLocalAuthSession } from '../../service/resolve-local-auth-session'
import { signOutUser } from './sign-out'

vi.mock('@shared/api', () => ({
  signOut: vi.fn(),
  getCurrentSession: vi.fn(),
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn(),
  clearUserContext: vi.fn()
}))

vi.mock('../../service/local-auth-state', () => ({
  notifyLocalAuthStateChanged: vi.fn()
}))

vi.mock('../../service/resolve-local-auth-session', () => ({
  revokeLocalAuthSession: vi.fn()
}))

vi.mock('../../register-user/service/register-storage', () => ({
  clearRegisterStorage: vi.fn()
}))

describe('signOutUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentSession).mockResolvedValue({ user: { id: 'user-1' } } as never)
  })

  it('clears contexts and storage on successful sign out', async () => {
    vi.mocked(signOut).mockResolvedValue({
      error: null
    })

    const result = await signOutUser()

    expect(result).toEqual({ success: true })
    expect(revokeLocalAuthSession).toHaveBeenCalledTimes(1)
    expect(notifyLocalAuthStateChanged).toHaveBeenCalledWith(null)
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(clearUserContext).toHaveBeenCalledTimes(1)
    expect(clearRegisterStorage).toHaveBeenCalledTimes(1)
    expect(captureException).not.toHaveBeenCalled()
  })

  it('signs out locally without calling Supabase when no cloud session exists', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    const result = await signOutUser()

    expect(result).toEqual({ success: true })
    expect(revokeLocalAuthSession).toHaveBeenCalledTimes(1)
    expect(signOut).not.toHaveBeenCalled()
    expect(clearUserContext).toHaveBeenCalledTimes(1)
    expect(clearRegisterStorage).toHaveBeenCalledTimes(1)
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
