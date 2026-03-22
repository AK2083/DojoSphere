import { AuthError, type AuthResponse, type User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from '../../../errors/app-error'
import { captureException, setUserContext } from '../../../lib/glitchtip/logging'
import { mapSupabaseError } from '../map-supabase-error'
import { signInByEmailPassword } from './auth'
import { signInWithEmailPassword } from './sign-in-with-email-password'

vi.mock('./auth', () => ({
  signInByEmailPassword: vi.fn()
}))

vi.mock('../map-supabase-error', () => ({
  mapSupabaseError: vi.fn()
}))

vi.mock('../../../lib/glitchtip/logging', () => ({
  captureException: vi.fn(),
  setUserContext: vi.fn()
}))

describe('signInWithEmailPassword', () => {
  const email = 'test@test.com'
  const password = 'password'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns mapped error when supabase returns error', async () => {
    const supabaseError = new AuthError('Invalid login', 400, 'invalid_credentials')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: supabaseError
    }

    const mappedError = new AppError('auth.invalid_credentials')

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithEmailPassword(email, password)

    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signInWithEmailPassword')

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)

    expect(result).toEqual({
      success: false,
      error: mappedError
    })
  })

  it('returns AppError when no user is returned', async () => {
    const response: AuthResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    const result = await signInWithEmailPassword(email, password)

    expect(captureException).toHaveBeenCalledWith(
      expect.any(AppError),
      'auth',
      'signInWithEmailPassword'
    )

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error).toBeInstanceOf(AppError)
      expect(result.error.message).toBe('User not found')
    }
  })

  it('returns success and sets user context when sign-in succeeds', async () => {
    const mockUser: User = {
      id: 'user-456'
    } as User

    const response: AuthResponse = {
      data: { user: mockUser, session: null },
      error: null
    }

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    const result = await signInWithEmailPassword(email, password)

    expect(setUserContext).toHaveBeenCalledWith({
      id: 'user-456'
    })

    expect(result).toEqual({
      success: true
    })
  })
})
