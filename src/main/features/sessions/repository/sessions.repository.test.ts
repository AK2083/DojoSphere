import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('sessions.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('creates and resolves an active session by token', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { createSession, getActiveSessionByToken } = await import('./sessions.repository')

    const { id: userId } = addUser({ displayName: 'Local User' })
    const session = createSession(userId)

    const resolved = getActiveSessionByToken(session.token)

    expect(resolved).toMatchObject({
      userId,
      user: {
        displayName: 'Local User',
        userType: 'local'
      }
    })
  })

  it('returns null after a session was revoked', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { createSession, getActiveSessionByToken, revokeSessionByToken } =
      await import('./sessions.repository')

    const { id: userId } = addUser({ displayName: 'Local User' })
    const session = createSession(userId)

    revokeSessionByToken(session.token)

    expect(getActiveSessionByToken(session.token)).toBeNull()
  })
})
