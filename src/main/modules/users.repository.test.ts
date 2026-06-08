import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'

describe('users.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns an empty list before users are added', async () => {
    await initTestDatabase()
    const { getUsers } = await import('./users.repository')

    expect(getUsers()).toEqual([])
  })

  it('persists and returns created users', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')

    addUser({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com'
    })

    const users = getUsers()

    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      userType: 'local'
    })
    expect(users[0]?.id).toEqual(expect.any(String))
    expect(users[0]?.createdAt).toEqual(expect.any(String))
  })

  it('stores optional fields with defaults', async () => {
    await initTestDatabase()
    const { addUser, getUsers } = await import('./users.repository')

    addUser({
      displayName: 'System Bot',
      userType: 'system'
    })

    expect(getUsers()[0]).toMatchObject({
      displayName: 'System Bot',
      email: null,
      userType: 'system'
    })
  })
})
