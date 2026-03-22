import { defineComponent, h } from 'vue'
import { supabase } from '@shared/api/supabase/client'
import type { Session } from '@supabase/supabase-js'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthSession } from './use-auth-session'

vi.mock('@shared/api/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }
}))

function createMockSession(overrides: Partial<Session> = {}): Session {
  return {
    access_token: 'at',
    refresh_token: 'rt',
    expires_in: 3600,
    expires_at: 1,
    token_type: 'bearer',
    user: {
      id: 'user-1',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2020-01-01T00:00:00.000Z'
    },
    ...overrides
  } as Session
}

describe('useAuthSession', () => {
  let auth: ReturnType<typeof useAuthSession>
  let unsubscribe: ReturnType<typeof vi.fn>

  const TestHost = defineComponent({
    setup() {
      auth = useAuthSession()
      return () => h('div')
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    unsubscribe = vi.fn()
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null }
    })
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(() => ({
      data: {
        subscription: { unsubscribe }
      }
    }))
  })

  async function mountSession() {
    const wrapper = mount(TestHost)
    await flushPromises()
    return wrapper
  }

  it('starts with no session when getSession returns null', async () => {
    await mountSession()

    expect(auth.session.value).toBeNull()
    expect(auth.isLoggedIn.value).toBe(false)
    expect(auth.user.value).toBeNull()
  })

  it('loads initial session from getSession on mount', async () => {
    const initial = createMockSession()
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: initial }
    })

    await mountSession()

    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1)
    expect(auth.session.value).toEqual(initial)
    expect(auth.isLoggedIn.value).toBe(true)
    expect(auth.user.value).toEqual(initial.user)
  })

  it('subscribes to onAuthStateChange and updates session when callback fires', async () => {
    let listener: ((event: string, session: Session | null) => void) | undefined

    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(
      (callback: (event: string, session: Session | null) => void) => {
        listener = callback
        return {
          data: {
            subscription: { unsubscribe }
          }
        }
      }
    )

    await mountSession()

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledTimes(1)

    const next = createMockSession({ access_token: 'next' })
    listener!('SIGNED_IN', next)

    expect(auth.session.value).toEqual(next)
    expect(auth.isLoggedIn.value).toBe(true)
    expect(auth.user.value).toEqual(next.user)
  })

  it('sets isLoggedIn false and user null when session is cleared', async () => {
    const initial = createMockSession()
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: initial }
    })

    let listener: ((event: string, session: Session | null) => void) | undefined

    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(
      (callback: (event: string, session: Session | null) => void) => {
        listener = callback
        return {
          data: {
            subscription: { unsubscribe }
          }
        }
      }
    )

    await mountSession()

    listener!('SIGNED_OUT', null)

    expect(auth.session.value).toBeNull()
    expect(auth.isLoggedIn.value).toBe(false)
    expect(auth.user.value).toBeNull()
  })

  it('unsubscribes from auth listener on unmount', async () => {
    const wrapper = await mountSession()

    wrapper.unmount()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
