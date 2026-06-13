import { describe, expect, it } from 'vitest'

import { mapLocalSessionToAuthSession } from './map-local-session-to-auth-session'

describe('mapLocalSessionToAuthSession', () => {
  it('maps a local session to the shared auth session shape', () => {
    const expiresAt = new Date(Date.now() + 60_000).toISOString()

    const session = mapLocalSessionToAuthSession({
      id: 'session-1',
      userId: 'user-1',
      expiresAt,
      createdAt: '2026-01-01T00:00:00.000Z',
      user: {
        id: 'user-1',
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        userType: 'local',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: null
      }
    })

    expect(session.user).toMatchObject({
      id: 'user-1',
      email: 'ada@example.com',
      app_metadata: { provider: 'local' },
      user_metadata: {
        full_name: 'Ada Lovelace',
        name: 'Ada Lovelace'
      }
    })
    expect(session.expires_at).toBeGreaterThan(0)
    expect(session.expires_in).toBeGreaterThanOrEqual(0)
  })

  it('omits email when the local user has none', () => {
    const session = mapLocalSessionToAuthSession({
      id: 'session-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
      user: {
        id: 'user-1',
        displayName: 'Ada Lovelace',
        email: null,
        userType: 'local',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: null
      }
    })

    expect(session.user.email).toBeUndefined()
  })
})
