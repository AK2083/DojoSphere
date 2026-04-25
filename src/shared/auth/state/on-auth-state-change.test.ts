import {
  type AuthChangeEvent,
  onAuthStateChange,
  type Session,
  type Subscription
} from '@shared/api'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { watchAuthState } from './on-auth-state-change'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('watchAuthState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps standard supabase events correctly and calls callback', () => {
    const mockSubscription = {
      id: 'sub-123',
      callback: vi.fn(),
      unsubscribe: vi.fn()
    } as Subscription

    const mockSession = { id: 'test-session' } as unknown as Session
    const callback = vi.fn()

    type AuthCallback = (event: AuthChangeEvent, session: Session | null) => void
    let capturedHandler: AuthCallback = () => {}

    vi.mocked(onAuthStateChange).mockImplementation((cb: AuthCallback) => {
      capturedHandler = cb
      return mockSubscription
    })

    const result = watchAuthState(callback)

    capturedHandler('SIGNED_IN', mockSession)

    expect(result).toBe(mockSubscription)
    expect(callback).toHaveBeenCalledWith({
      event: 'SIGNED_IN',
      session: mockSession
    })
    expect(captureException).not.toHaveBeenCalled()
  })

  it('maps unknown events to UNKNOWN and logs exception', () => {
    const callback = vi.fn()

    let capturedHandler: (event: AuthChangeEvent, session: Session | null) => void = () => {}

    vi.mocked(onAuthStateChange).mockImplementation((cb) => {
      capturedHandler = cb
      return { id: '1', unsubscribe: vi.fn(), callback: vi.fn() } as Subscription
    })

    watchAuthState(callback)

    const weirdEvent = 'SOME_NEW_EVENT'
    capturedHandler(weirdEvent as AuthChangeEvent, null)

    expect(callback).toHaveBeenCalledWith({
      event: 'UNKNOWN',
      session: null
    })

    expect(vi.mocked(captureException)).toHaveBeenCalledWith(
      expect.any(Error),
      'auth',
      'watchAuthState'
    )
  })

  it('logs exception when TOKEN_REFRESHED occurs without a session', () => {
    const callback = vi.fn()
    let capturedHandler: (event: AuthChangeEvent, session: Session | null) => void = () => {}

    vi.mocked(onAuthStateChange).mockImplementation((cb) => {
      capturedHandler = cb
      return { id: '1', unsubscribe: vi.fn(), callback: vi.fn() } as Subscription
    })

    watchAuthState(callback)

    capturedHandler('TOKEN_REFRESHED', null)

    expect(vi.mocked(captureException)).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token refresh event received but session is null' }),
      'auth',
      'watchAuthState'
    )
  })
})
