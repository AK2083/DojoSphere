import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { isSupabaseRequestAllowed } = vi.hoisted(() => ({
  isSupabaseRequestAllowed: vi.fn(() => true)
}))

import { supabase } from '../client'
import {
  type AuthError,
  type AuthOtpResponse,
  type AuthResponse,
  type Session,
  type Subscription
} from '../types/auth-user'
import {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  requestPasswordRecovery,
  resendSignUpConfirmation,
  signInByEmailPassword,
  signInWithOtp,
  signOut,
  signUpByEmailPassword,
  updateUserPassword,
  verifyOneTimePasswordByRecovery,
  verifyOneTimePasswordBySignUp
} from './auth'

vi.mock('../client', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      verifyOtp: vi.fn(),
      resend: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn(),
  setUserContext: vi.fn()
}))

vi.mock('../connectivity-guard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../connectivity-guard')>()

  return {
    ...actual,
    isSupabaseRequestAllowed
  }
})

describe('signUpByEmailPassword', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
    isSupabaseRequestAllowed.mockReturnValue(true)
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

describe('signInWithOtp', () => {
  const email = 'otp@example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signInWithOtp with shouldCreateUser false', async () => {
    const mockResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue(mockResponse as AuthOtpResponse)

    const result = await signInWithOtp(email)

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email,
      options: {
        shouldCreateUser: false
      }
    })
    expect(result).toEqual(mockResponse)
  })
})

describe('requestPasswordRecovery', () => {
  const email = 'recovery@example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.resetPasswordForEmail with correct email', async () => {
    const mockResponse = {
      data: {},
      error: null
    }

    vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue(mockResponse as never)

    const result = await requestPasswordRecovery(email)

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email)
    expect(result).toEqual(mockResponse)
  })
})

describe('signInByEmailPassword', () => {
  const email = 'test@example.com'
  const password = 'password123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signInWithPassword with correct parameters', async () => {
    const mockResponse = {
      data: { user: null, session: null },
      error: null
    }

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse as never)

    const result = await signInByEmailPassword(email, password)

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password
    })

    expect(result).toEqual(mockResponse)
  })

  it('returns error response from supabase unchanged', async () => {
    const mockError = new Error('Sign-in failed')

    const mockResponse = {
      data: { user: null, session: null },
      error: mockError
    }

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse as never)

    const result = await signInByEmailPassword(email, password)

    expect(result.error).toBe(mockError)
  })
})

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signOut and returns its response', async () => {
    const mockResponse = {
      error: null
    }

    vi.mocked(supabase.auth.signOut).mockResolvedValue(mockResponse as never)

    const result = await signOut()

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResponse)
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

    await verifyOneTimePasswordBySignUp('test@test.de', '123456')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'test@test.de',
      token: '123456',
      type: 'signup'
    })
    expect(supabase.auth.verifyOtp).toHaveBeenCalledTimes(1)
  })
})

describe('verifyOneTimePasswordByRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.verifyOtp with recovery type', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { session: null, user: null },
      error: null
    })

    await verifyOneTimePasswordByRecovery('recovery@test.de', '654321')

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'recovery@test.de',
      token: '654321',
      type: 'recovery'
    })
    expect(supabase.auth.verifyOtp).toHaveBeenCalledTimes(1)
  })
})

describe('resendSignUpConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.resend with type and email', async () => {
    vi.mocked(supabase.auth.resend).mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })

    await resendSignUpConfirmation('test@test.de')

    expect(supabase.auth.resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'test@test.de'
    })
    expect(supabase.auth.resend).toHaveBeenCalledTimes(1)
  })
})

describe('getCurrentSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when successful', async () => {
    const mockSession = {
      access_token: 'abc',
      refresh_token: 'def',
      expires_in: 3600,
      token_type: 'bearer',
      user: { id: 'user-123' }
    } as Session

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null
    })

    const result = await getCurrentSession()
    expect(result).toEqual(mockSession)
  })

  it('logs error and returns null when supabase returns an error', async () => {
    const mockError = {
      name: 'AuthError',
      message: 'Session expired',
      status: 401,
      __isAuthError: true
    } as unknown as AuthError

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: mockError
    })

    const result = await getCurrentSession()

    expect(result).toBeNull()
  })

  it('returns null when getSession throws unexpectedly', async () => {
    vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('Network offline'))

    const result = await getCurrentSession()

    expect(result).toBeNull()
    expect(captureException).toHaveBeenCalledTimes(1)
  })
})

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user response from supabase unchanged', async () => {
    const mockResponse = {
      data: {
        user: { id: 'user-123' }
      },
      error: null
    }

    vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse as never)

    const result = await getCurrentUser()

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResponse)
  })
})

describe('onAuthStateChange', () => {
  it('subscribes and returns subscription object', () => {
    const mockSubscription = {
      id: 'sub-123',
      callback: vi.fn(),
      unsubscribe: vi.fn()
    } as Subscription

    const mockResponse: ReturnType<typeof supabase.auth.onAuthStateChange> = {
      data: {
        subscription: mockSubscription
      }
    }

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue(mockResponse)
    const callback = vi.fn()
    const result = onAuthStateChange(callback)

    expect(result).toBe(mockSubscription)
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(callback)
  })
})

describe('updateUserPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.updateUser with the new password', async () => {
    const mockResponse = {
      data: { user: null },
      error: null
    }

    vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockResponse as never)

    const result = await updateUserPassword('new-password-123')

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: 'new-password-123'
    })
    expect(result).toEqual(mockResponse)
  })
})

describe('supabase connectivity guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isSupabaseRequestAllowed.mockReturnValue(false)
  })

  it('blocks auth API calls when Supabase is unreachable', async () => {
    await expect(signInWithOtp('test@example.com')).resolves.toMatchObject({
      data: { user: null, session: null },
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(requestPasswordRecovery('test@example.com')).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(getCurrentUser()).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(getCurrentSession()).resolves.toBeNull()
    await expect(signUpByEmailPassword('test@example.com', 'password')).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(signInByEmailPassword('test@example.com', 'password')).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(signOut()).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(
      verifyOneTimePasswordBySignUp('test@example.com', '123456')
    ).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(
      verifyOneTimePasswordByRecovery('test@example.com', '123456')
    ).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(resendSignUpConfirmation('test@example.com')).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })
    await expect(updateUserPassword('new-password')).resolves.toMatchObject({
      error: expect.objectContaining({ code: 'network_error' })
    })

    expect(supabase.auth.signInWithOtp).not.toHaveBeenCalled()
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled()
    expect(supabase.auth.getUser).not.toHaveBeenCalled()
    expect(supabase.auth.getSession).not.toHaveBeenCalled()
    expect(supabase.auth.signUp).not.toHaveBeenCalled()
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
    expect(supabase.auth.signOut).not.toHaveBeenCalled()
    expect(supabase.auth.verifyOtp).not.toHaveBeenCalled()
    expect(supabase.auth.resend).not.toHaveBeenCalled()
    expect(supabase.auth.updateUser).not.toHaveBeenCalled()
  })
})
