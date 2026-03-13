import { mapSupabaseError } from '@shared/api/supabase/map-error'
import { AuthError, type AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from '../../errors/app-error'
import { supabase } from './client'
import { registerUser } from './user'

vi.mock('@shared/api/supabase/map-error', () => ({
  mapSupabaseError: vi.fn()
}))

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase signUp and returns data', async () => {
    const mockData = { user: { id: '1', email: 'test@test.com' } }

    vi.spyOn(supabase.auth, 'signUp').mockResolvedValue({
      data: mockData,
      error: null
    } as AuthResponse)

    const result = await registerUser('test@test.com', 'password')

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })

    expect(result).toEqual(mockData)
  })

  it('maps supabase error and throws AppError', async () => {
    const supabaseError = new AuthError('Invalid login', 400, 'invalid_credentials')

    const response: AuthResponse = {
      data: { user: null, session: null },
      error: supabaseError
    }

    const mappedError = new AppError('auth.invalid_credentials')

    vi.spyOn(supabase.auth, 'signUp').mockResolvedValue(response)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    await expect(registerUser('test@test.com', 'password')).rejects.toThrow(mappedError)

    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)
  })
})
