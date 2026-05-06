import { describe, expect, it } from 'vitest'

import { getAuthSessionStorageKey } from './auth-storage'

describe('auth storage', () => {
  it('returns the supabase auth session storage key', () => {
    expect(getAuthSessionStorageKey()).toBe('dojosphere.auth.session')
  })
})
