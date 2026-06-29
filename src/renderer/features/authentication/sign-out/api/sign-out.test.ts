import { mapSupabaseError, signOut } from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import type { AuthError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signOutFromSupabase } from './sign-out'

vi.mock('@shared/api', () => ({
  signOut: vi.fn(),
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  logError: vi.fn()
}))

describe('signOutFromSupabase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when sign out succeeds', async () => {
    vi.mocked(signOut).mockResolvedValue({ error: null })

    const result = await signOutFromSupabase()

    expect(result).toEqual({ success: true })
    expect(logError).not.toHaveBeenCalled()
  })

  it('returns retry error without logging', async () => {
    const mappedError = new AppError('shared.error.retry')

    vi.mocked(signOut).mockResolvedValue({
      error: {
        message: 'Failed to fetch',
        code: 'network_error'
      } as AuthError
    })
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signOutFromSupabase()

    expect(result).toEqual({ success: false, error: mappedError })
    expect(logError).not.toHaveBeenCalled()
  })

  it('logs unexpected mapped errors', async () => {
    const mappedError = new AppError('shared.error.unknown')

    vi.mocked(signOut).mockResolvedValue({
      error: {
        message: 'Auth subsystem unavailable',
        code: 'unexpected_failure'
      } as AuthError
    })
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signOutFromSupabase()

    expect(result).toEqual({ success: false, error: mappedError })
    expect(logError).toHaveBeenCalledWith(mappedError, 'auth', 'signOutUser')
  })
})
