import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasSupabaseAuthSessionInStorage } from './cloud-status-storage'

const AUTH_SESSION_KEY = 'dojosphere.auth.session'

describe('cloud-status storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.localStorage.clear()
  })

  it('returns false when supabase auth storage is empty', () => {
    expect(hasSupabaseAuthSessionInStorage()).toBe(false)
  })

  it('returns true when supabase auth storage contains an access token', () => {
    globalThis.localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({ access_token: 'token-value' })
    )

    expect(hasSupabaseAuthSessionInStorage()).toBe(true)
  })

  it('returns false when supabase auth storage is invalid json', () => {
    globalThis.localStorage.setItem(AUTH_SESSION_KEY, 'not-json')

    expect(hasSupabaseAuthSessionInStorage()).toBe(false)
  })
})
