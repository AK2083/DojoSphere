import { describe, expect, it } from 'vitest'

import { isLocalAuthSession } from './is-local-auth-session'

describe('isLocalAuthSession', () => {
  it('returns true for local provider sessions', () => {
    expect(
      isLocalAuthSession({
        user: { app_metadata: { provider: 'local' } }
      } as never)
    ).toBe(true)
  })

  it('returns false for cloud sessions and missing sessions', () => {
    expect(
      isLocalAuthSession({
        user: { app_metadata: { provider: 'email' } }
      } as never)
    ).toBe(false)
    expect(isLocalAuthSession(null)).toBe(false)
  })
})
