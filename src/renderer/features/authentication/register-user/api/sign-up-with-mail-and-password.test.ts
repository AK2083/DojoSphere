import {
  type AuthError,
  type AuthResponse,
  mapSupabaseError,
  signUpByEmailPassword,
  type User
} from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signUpWithMailAndPassword } from './sign-up-with-mail-and-password'

vi.mock('@shared/api')
vi.mock('@shared/lib', () => ({
  logError: vi.fn()
}))

describe('signUpWithMailAndPassword', () => {
  const email = 'test@test.com'
  const password = 'password'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns AppError when no user is returned', async () => {
    vi.mocked(signUpByEmailPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    } satisfies AuthResponse)

    const result = await signUpWithMailAndPassword(email, password)

    expect(logError).toHaveBeenCalledWith(expect.any(AppError), 'auth', 'signUpWithMailAndPassword')
    expect(result).toMatchObject({ success: false, error: { message: 'User not found' } })
  })

  it('returns mapped error when supabase signup fails', async () => {
    const supabaseError = {
      message: 'signup failed',
      status: 400,
      code: 'shared.error.unknown',
      name: 'AuthError'
    } as AuthError
    const mappedError = new AppError('shared.error.unknown')

    vi.mocked(signUpByEmailPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: supabaseError
    } satisfies AuthResponse)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signUpWithMailAndPassword(email, password)

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)
    expect(logError).toHaveBeenCalledWith(mappedError, 'auth', 'signUpWithMailAndPassword')
    expect(result).toEqual({ success: false, error: mappedError })
  })

  it('returns success when signup succeeds', async () => {
    const mockUser: User = { id: 'user-123' } as User

    vi.mocked(signUpByEmailPassword).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    } satisfies AuthResponse)

    const result = await signUpWithMailAndPassword(email, password)

    expect(logError).not.toHaveBeenCalled()
    expect(result).toEqual({ success: true })
  })
})
