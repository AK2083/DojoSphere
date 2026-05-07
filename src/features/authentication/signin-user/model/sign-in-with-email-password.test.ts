import {
  type AuthError,
  type AuthResponse,
  mapSupabaseError,
  signInByEmailPassword,
  type User
} from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException, setUserContext } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signInWithEmailPassword } from './sign-in-with-email-password'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('signInWithEmailPassword', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success and sets user context', async () => {
    const response = {
      data: {
        user: { id: 'user-1' } as User,
        session: null
      },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toEqual({ success: true })
    expect(setUserContext).toHaveBeenCalledWith({ id: 'user-1' })
  })

  it('does not capture expected invalid credential errors', async () => {
    const supabaseError = {
      message: 'Invalid login',
      status: 400,
      code: 'invalid_credentials',
      name: 'AuthError'
    } as AuthError
    const mappedError = new AppError('invalid_credentials', 'Invalid credentials')

    vi.mocked(signInByEmailPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: supabaseError
    } satisfies AuthResponse)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toEqual({ success: false, error: mappedError })
    expect(captureException).not.toHaveBeenCalled()
  })

  it('captures unexpected mapped errors', async () => {
    const supabaseError = {
      message: 'Auth degraded',
      status: 500,
      code: 'unexpected_failure',
      name: 'AuthError'
    } as AuthError
    const mappedError = new AppError('shared.error.unknown', 'Auth degraded')

    vi.mocked(signInByEmailPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: supabaseError
    } satisfies AuthResponse)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toEqual({ success: false, error: mappedError })
    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signInWithEmailPassword')
  })

  it('returns fallback AppError when user is missing', async () => {
    vi.mocked(signInByEmailPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toMatchObject({
      success: false,
      error: { code: 'unknown', message: 'User not found' }
    })
    expect(captureException).toHaveBeenCalledWith(
      expect.any(AppError),
      'auth',
      'signInWithEmailPassword'
    )
  })
})
