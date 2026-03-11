import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from './client'
import type { AuthUser } from '@shared/types'
import { AuthError } from '@supabase/supabase-js'
import { signUp } from './auth'

vi.mock('./client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    }
  }
}))

describe('signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signUp with email and password', async () => {
    const mockResponse = {
      data: {
        user: { id: '123' } as AuthUser,
        session: null
      },
      error: null
    }

    vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse)

    const result = await signUp('test@test.de', 'password123')

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.de',
      password: 'password123'
    })

    expect(result).toEqual(mockResponse.data)
  })

  it('throws error when supabase returns error', async () => {
    const mockError = new AuthError('Signup failed')

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    })

    await expect(signUp('test@test.de', 'password123')).rejects.toThrow(
      'Signup failed'
    )
  })
})
