import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasLocalAccess } from './has-local-access'

describe('hasLocalAccess', () => {
  beforeEach(() => {
    globalThis.window.api = {
      getUsers: vi.fn(),
      addUser: vi.fn(),
      dbHealthcheck: vi.fn(),
      getOsUsername: vi.fn()
    }
  })

  it('returns false when window.api is unavailable', async () => {
    Object.defineProperty(globalThis.window, 'api', {
      configurable: true,
      value: undefined
    })

    await expect(hasLocalAccess()).resolves.toBe(false)
  })

  it('returns true when at least one local user exists', async () => {
    vi.mocked(globalThis.window.api.getUsers).mockResolvedValue([
      {
        id: '1',
        displayName: 'Ada',
        email: null,
        userType: 'local',
        createdAt: '2026-01-01',
        updatedAt: null
      }
    ])

    await expect(hasLocalAccess()).resolves.toBe(true)
  })

  it('returns false when only non-local users exist', async () => {
    vi.mocked(globalThis.window.api.getUsers).mockResolvedValue([
      {
        id: '1',
        displayName: 'System',
        email: null,
        userType: 'system',
        createdAt: '2026-01-01',
        updatedAt: null
      }
    ])

    await expect(hasLocalAccess()).resolves.toBe(false)
  })
})
