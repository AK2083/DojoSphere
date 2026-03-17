import { mapSupabaseError } from '@shared/api/supabase/map-supabase-error'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import { AuthError, type AuthResponse, type User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signUpByEmailPassword } from './auth'
import { signUpWithMailAndPassword } from './sign-up-with-mail-and-password'

vi.mock('./auth', () => ({
  signUpByEmailPassword: vi.fn()
}))

vi.mock('@shared/api/supabase/map-supabase-error', () => ({
  mapSupabaseError: vi.fn()
}))

vi.mock('@shared/lib/glitchtip/logging', () => ({
  captureException: vi.fn(),
  setUserContext: vi.fn()
}))

describe('signUpWithMailAndPassword', () => {
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

    vi.mocked(signUpByEmailPassword).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signUpWithMailAndPassword(email, password)

    expect(captureException).toHaveBeenCalledWith(
      supabaseError,
      'auth',
      'signUpWithMailAndPassword'
    )

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

    vi.mocked(signUpByEmailPassword).mockResolvedValue(response)

    const result = await signUpWithMailAndPassword(email, password)

    expect(captureException).toHaveBeenCalledWith(
      expect.any(AppError),
      'auth',
      'signUpWithMailAndPassword'
    )

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error).toBeInstanceOf(AppError)
      expect(result.error.message).toBe('User not found')
    }
  })

  it('returns success and sets user context when signup succeeds', async () => {
    const mockUser: User = {
      id: 'user-123'
    } as User

    const response: AuthResponse = {
      data: { user: mockUser, session: null },
      error: null
    }

    vi.mocked(signUpByEmailPassword).mockResolvedValue(response)

    const result = await signUpWithMailAndPassword(email, password)

    expect(setUserContext).toHaveBeenCalledWith({
      id: 'user-123'
    })

    expect(result).toEqual({
      success: true
    })
  })
})
