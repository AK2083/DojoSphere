import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('roles.repository', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns the role id for a seeded role name', async () => {
    await initTestDatabase()
    const { findRoleIdByName } = await import('./roles.repository')

    const roleId = findRoleIdByName('list_keeper')

    expect(roleId).toEqual(expect.any(String))
    expect(roleId.length).toBeGreaterThan(0)
  })

  it('throws when the role name does not exist', async () => {
    await initTestDatabase()
    const { findRoleIdByName } = await import('./roles.repository')

    expect(() => findRoleIdByName('missing_role')).toThrow('Role not found: missing_role')
  })
})
