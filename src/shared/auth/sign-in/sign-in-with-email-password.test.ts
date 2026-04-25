import type { AuthError, AuthResponse, User } from '@shared/api'
import * as api from '@shared/api'
import * as errorMapper from '@shared/api/supabase/map-supabase-error'
import { AppError } from '@shared/errors'
import * as logging from '@shared/lib/glitchtip/logging'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signInWithEmailPassword } from './sign-in-with-email-password'

vi.mock('@shared/api')
vi.mock('@shared/api/supabase/map-supabase-error')
vi.mock('@shared/lib/glitchtip/logging')

describe('signInWithEmailPassword', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success and sets user context', async () => {
    const response = {
      data: {
        user: {
          id: 'user-1'
        } as User,
        session: null
      },
      error: null
    } satisfies AuthResponse

    vi.spyOn(api, 'signInByEmailPassword').mockResolvedValue(response)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toEqual({ success: true })
    expect(logging.setUserContext).toHaveBeenCalledWith({ id: 'user-1' })
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

    vi.spyOn(api, 'signInByEmailPassword').mockResolvedValue(response)
    vi.spyOn(errorMapper, 'mapSupabaseError').mockReturnValue(mappedError)

    const result = await signInWithEmailPassword(email, password)

    expect(result).toMatchObject({ success: false })

    const err = (result as { success: false; error: AppError }).error

    expect(err.code).toBe('invalid_credentials')
    expect(err.message).toBe('Invalid credentials')
    expect(err.details).toEqual({ reason: 'password_wrong' })

    expect(logging.captureException).toHaveBeenCalledWith(
      mappedError,
      'auth',
      'signInWithEmailPassword'
    )
  })

  it('creates fallback AppError when user is missing', async () => {
    vi.spyOn(api, 'signInByEmailPassword').mockResolvedValue({
      data: {
        user: null,
        session: null
      },
      error: null
    })

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

    expect(logging.captureException).toHaveBeenCalledWith(
      expect.any(AppError),
      'auth',
      'signInWithEmailPassword'
    )
  })

  it('does not set user context on failure', async () => {
    const response = {
      data: {
        user: null,
        session: null
      },
      error: null
    } satisfies AuthResponse

    vi.spyOn(api, 'signInByEmailPassword').mockResolvedValue(response)

    await signInWithEmailPassword(email, password)

    expect(logging.setUserContext).not.toHaveBeenCalled()
  })

  it('calls API with correct parameters', async () => {
    const response = {
      data: {
        user: {
          id: '123'
        } as User,
        session: null
      },
      error: null
    } satisfies AuthResponse

    const spy = vi.spyOn(api, 'signInByEmailPassword').mockResolvedValue(response)

    await signInWithEmailPassword(email, password)

    expect(spy).toHaveBeenCalledWith(email, password)
  })
})
