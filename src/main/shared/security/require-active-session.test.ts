import { describe, expect, it } from 'vitest'

import { requireActiveSession } from './require-active-session'

describe('requireActiveSession', () => {
  it('returns the session when the token is valid', () => {
    const session = {
      id: 'session-1',
      userId: 'user-1'
    }

    expect(requireActiveSession('valid-token', () => session)).toBe(session)
  })

  it('throws when the token is invalid', () => {
    expect(() => requireActiveSession('invalid-token', () => null)).toThrow('Unauthorized')
  })
})
