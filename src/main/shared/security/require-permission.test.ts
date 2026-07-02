import { describe, expect, it } from 'vitest'

import { requirePermission } from './require-permission'

describe('requirePermission', () => {
  it('does not throw when the permission is granted', () => {
    expect(() =>
      requirePermission('user-1', 'participants-overview', 'read', () => true)
    ).not.toThrow()
  })

  it('throws Forbidden when the permission is missing', () => {
    expect(() => requirePermission('user-1', 'participants-overview', 'read', () => false)).toThrow(
      'Forbidden'
    )
  })
})
