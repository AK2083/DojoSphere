import { captureException } from '@shared/lib/glitchtip/logging'
import { AuthError, type AuthResponse } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signUpByEmailPassword, verifyOneTimePassword } from './auth'
import { supabase } from './client'

vi.mock('./client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      verifyOtp: vi.fn()
    }
  }
}))

vi.mock('@shared/lib/glitchtip/logging', () => ({
  captureException: vi.fn(),
  setUserContext: vi.fn()
}))

describe('signUpByEmailPassword', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signUp with correct parameters', async () => {
    const mockResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse as AuthResponse)

    const result = await signUpByEmailPassword(email, password)

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password
    })

    expect(result).toEqual(mockResponse)
  })

  it('returns error response from supabase unchanged', async () => {
    const mockError = new Error('Signup failed')

    const mockResponse = {
      data: { user: null, session: null },
      error: mockError
    }

    vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse as AuthResponse)

    const result = await signUpByEmailPassword(email, password)

    expect(result.error).toBe(mockError)
  })
})

describe('checkOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.verifyOtp with email and token', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { session: null, user: null },
      error: null
    })

    await verifyOneTimePassword('test@test.de', '123456')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'test@test.de',
      token: '123456',
      type: 'signup'
    })
  })

  it('calls verifyOtp exactly once', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { session: null, user: null },
      error: null
    })

    await verifyOneTimePassword('test@test.de', '123456')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledTimes(1)
  })
})
