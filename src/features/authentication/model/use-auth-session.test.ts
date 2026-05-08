import type { AuthSession, AuthState, AuthUser } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentSession } from './get-current-session'
import { watchAuthState } from './on-auth-state-change'
import { useAuthSession } from './use-auth-session'

type AuthWatcherPayload = { event: string; session: AuthSession | null }
type AuthWatcherCallback = (payload: AuthWatcherPayload) => void

let onMountedHandler: (() => Promise<void>) | undefined
let onUnmountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => Promise<void>) => {
      onMountedHandler = callback
    },
    onUnmounted: (callback: () => void) => {
      onUnmountedHandler = callback
    }
  }
})

vi.mock('./get-current-session', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('./on-auth-state-change', () => ({
  watchAuthState: vi.fn()
}))

describe('useAuthSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    onMountedHandler = undefined
    onUnmountedHandler = undefined
  })

  it('loads initial session and reacts to auth-state updates', async () => {
    const initialUser = { id: 'user-1' } as AuthUser
    const initialSession = { user: initialUser } as AuthSession
    const updatedSession = { user: { id: 'user-2' } as AuthUser } as AuthSession
    const unsubscribe = vi.fn()
    let capturedCallback: AuthWatcherCallback | undefined

    vi.mocked(getCurrentSession).mockResolvedValue(initialSession)

    vi.mocked(watchAuthState).mockImplementation((callback: (state: AuthState) => void) => {
      capturedCallback = callback as AuthWatcherCallback
      return {
        id: 'subscription-1',
        callback: vi.fn(),
        unsubscribe
      }
    })

    const { session, isLoggedIn, user } = useAuthSession()

    expect(session.value).toBeNull()
    expect(isLoggedIn.value).toBe(false)
    expect(user.value).toBeNull()

    expect(onMountedHandler).toBeDefined()
    await onMountedHandler?.()

    expect(getCurrentSession).toHaveBeenCalledTimes(1)
    expect(watchAuthState).toHaveBeenCalledTimes(1)
    expect(session.value).toStrictEqual(initialSession)
    expect(isLoggedIn.value).toBe(true)
    expect(user.value).toStrictEqual(initialUser)

    expect(capturedCallback).toBeDefined()
    capturedCallback?.({ event: 'SIGNED_IN', session: updatedSession })

    expect(session.value).toStrictEqual(updatedSession)
    expect(user.value).toStrictEqual(updatedSession.user)

    capturedCallback?.({ event: 'SIGNED_OUT', session: null })

    expect(session.value).toBeNull()
    expect(isLoggedIn.value).toBe(false)
    expect(user.value).toBeNull()

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('does not fail on unmount when no subscription exists yet', () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    const unsubscribe = vi.fn()
    vi.mocked(watchAuthState).mockReturnValue({
      id: 'subscription-2',
      callback: vi.fn(),
      unsubscribe
    })

    useAuthSession()

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()

    expect(unsubscribe).not.toHaveBeenCalled()
    expect(watchAuthState).not.toHaveBeenCalled()
  })
})
