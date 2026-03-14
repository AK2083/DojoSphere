import { captureException, setUserContext } from '@shared/lib/glitchtip/logging'
import type { AuthUser } from '@shared/types'
import { AuthError } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkOtp, signUp } from './auth'
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

    expect(setUserContext).toHaveBeenCalledWith({
      id: '123'
    })

    expect(result).toEqual(mockResponse.data)
  })

  it('logs and throws error when supabase returns error', async () => {
    const mockError = new AuthError('Signup failed')

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    })

    await expect(signUp('test@test.de', 'password123')).rejects.toThrow('Signup failed')

    expect(captureException).toHaveBeenCalledWith(mockError, 'auth', 'signUp')
  })

  it('logs and throws error if user is missing after signup', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })

    await expect(signUp('test@test.de', 'password123')).rejects.toThrow(
      'User not found after sign up'
    )

    expect(captureException).toHaveBeenCalled()
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

    await checkOtp('test@test.de', '123456')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'test@test.de',
      token: '123456',
      type: 'signup'
    })
  })

  it('logs and throws error when verifyOtp returns error', async () => {
    const mockError = new AuthError('OTP invalid')

    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { session: null, user: null },
      error: mockError
    })

    await expect(checkOtp('test@test.de', '123456')).rejects.toThrow('OTP invalid')

    expect(captureException).toHaveBeenCalledWith(mockError, 'auth', 'checkOtp')
  })

  it('calls verifyOtp exactly once', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { session: null, user: null },
      error: null
    })

    await checkOtp('test@test.de', '123456')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledTimes(1)
  })
})
