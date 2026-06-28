import { getCurrentSession } from '@shared/api'
import { AppError } from '@shared/errors'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearRegisterStorage } from '../../register-user/service/register-storage'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { revokeLocalAuthSession } from '../../service/resolve-local-auth-session'
import { signOutFromSupabase } from '../api/sign-out'
import { signOutUser } from './sign-out'

vi.mock('@shared/api', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('../api/sign-out', () => ({
  signOutFromSupabase: vi.fn()
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

  it('clears storage on successful sign out', async () => {
    vi.mocked(signOutFromSupabase).mockResolvedValue({ success: true })

    const result = await signOutUser()

    expect(result).toEqual({ success: true })
    expect(revokeLocalAuthSession).toHaveBeenCalledTimes(1)
    expect(notifyLocalAuthStateChanged).toHaveBeenCalledWith(null)
    expect(signOutFromSupabase).toHaveBeenCalledTimes(1)
    expect(clearRegisterStorage).toHaveBeenCalledTimes(1)
  })

  it('signs out locally without calling Supabase when no cloud session exists', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    const result = await signOutUser()

    expect(result).toEqual({ success: true })
    expect(revokeLocalAuthSession).toHaveBeenCalledTimes(1)
    expect(signOutFromSupabase).not.toHaveBeenCalled()
    expect(clearRegisterStorage).toHaveBeenCalledTimes(1)
  })

  it('returns mapped error without clearing storage', async () => {
    const mappedError = new AppError('shared.error.retry')

    vi.mocked(signOutFromSupabase).mockResolvedValue({
      success: false,
      error: mappedError
    })

    const result = await signOutUser()

    expect(result).toEqual({ success: false, error: mappedError })
    expect(clearRegisterStorage).not.toHaveBeenCalled()
  })
})
