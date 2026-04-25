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

  it('maps supabase error and returns AppError with correct code', async () => {
    const supabaseError = {
      message: 'Invalid login',
      status: 400,
      code: 'invalid_credentials',
      name: 'AuthError'
    } as AuthError

    const mappedError = new AppError('invalid_credentials', 'Invalid credentials', {
      reason: 'password_wrong'
    })

    const response = {
      data: { user: null, session: null },
      error: supabaseError
    } satisfies AuthResponse

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toMatchObject({ success: false })

    const err = (result as { success: false; error: AppError }).error

    expect(err.code).toBe('invalid_credentials')
    expect(err.message).toBe('Invalid credentials')
    expect(err.details).toEqual({ reason: 'password_wrong' })

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)

    expect(captureException).toHaveBeenCalledWith(mappedError, 'auth', 'signInWithEmailPassword')
  })

  it('creates fallback AppError when user is missing', async () => {
    const response = {
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'unknown',
          message: 'User not found'
        })
      })
    )

    expect(captureException).toHaveBeenCalledWith(
      expect.any(AppError),
      'auth',
      'signInWithEmailPassword'
    )
  })

  it('does not set user context on failure', async () => {
    const response = {
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    await signInWithEmailPassword(email, password)

    expect(setUserContext).not.toHaveBeenCalled()
  })

  it('calls API with correct parameters', async () => {
    const response = {
      data: {
        user: { id: '123' } as User,
        session: null
      },
      error: null
    } satisfies AuthResponse

    vi.mocked(signInByEmailPassword).mockResolvedValue(response)

    await signInWithEmailPassword(email, password)

    expect(signInByEmailPassword).toHaveBeenCalledWith(email, password)
  })
})
