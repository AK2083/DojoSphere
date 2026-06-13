import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearLocalSessionToken,
  getLocalSessionToken,
  setLocalSessionToken
} from './local-session-storage'

describe('local-session-storage', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  it('stores, reads, and clears the local session token', () => {
    expect(getLocalSessionToken()).toBeNull()

    setLocalSessionToken('token-123')

    expect(getLocalSessionToken()).toBe('token-123')

    clearLocalSessionToken()

    expect(getLocalSessionToken()).toBeNull()
  })
})
