import {
  type AuthError,
  type AuthResponse,
  mapSupabaseError,
  signUpByEmailPassword,
  type User
} from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signUpWithMailAndPassword } from './sign-up-with-mail-and-password'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('signUpWithMailAndPassword', () => {
  const email = 'test@test.com'
  const password = 'password'

  beforeEach(() => {
    vi.clearAllMocks()
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

  it('returns mapped error when supabase signup fails', async () => {
    const supabaseError = {
      message: 'signup failed',
      status: 400,
      code: 'shared.error.unknown',
      name: 'AuthError'
    } as AuthError

    const mappedError = new AppError('shared.error.unknown')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: supabaseError
    }

    vi.mocked(signUpByEmailPassword).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signUpWithMailAndPassword(email, password)

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)
    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signUpWithMailAndPassword')
    expect(setUserContext).not.toHaveBeenCalled()
    expect(result).toEqual({
      success: false,
      error: mappedError
    })
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
