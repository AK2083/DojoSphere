import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../test/database'

describe('audit module load order', () => {
  afterEach(async () => {
    await closeTestDatabase()
    vi.resetModules()
  })

  it('records role assignment when the users feature loads the audit barrel first', async () => {
    await initTestDatabase()
    vi.resetModules()
    await initTestDatabase()

    const { addUser } = await import('@main/features/users')
    const { getDatabase } = await import('@main/shared/database')

    addUser({ displayName: 'Load Order User' })

    const auditCount = getDatabase()
      .prepare('SELECT COUNT(*) AS count FROM authorization_audit_logs WHERE entity_type = ?')
      .get('role') as { count: number }

    expect(auditCount.count).toBe(1)
  })
})
