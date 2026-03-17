import { mapSupabaseError } from '@shared/api/supabase/map-supabase-error'
import { AuthError, type AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from '../../errors/app-error'
import { supabase } from './client'
import { signUpWithMailAndPassword } from './sign-up-with-mail-and-password'

vi.mock('@shared/api/supabase/map-error', () => ({
  mapSupabaseError: vi.fn()
}))

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase signUp and returns success', async () => {
    vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
      data: { user: { id: '1', email: 'test@test.com' }, session: null },
      error: null
    } as AuthResponse)

    const result = await signUpWithMailAndPassword('test@test.com', 'password')

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })

    expect(result).toEqual({ success: true })
  })

  it('maps supabase error and returns failure result', async () => {
    const supabaseError = new AuthError('Invalid login', 400, 'invalid_credentials')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: supabaseError
    }

    const mappedError = new AppError('auth.invalid_credentials')

    vi.spyOn(supabase.auth, 'signUp').mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await signUpWithMailAndPassword('test@test.com', 'password')

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)

    expect(result).toEqual({
      success: false,
      error: mappedError
    })
  })
})
