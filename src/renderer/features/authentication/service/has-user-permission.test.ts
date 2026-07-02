import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasUserPermission } from './has-user-permission'
import { getLocalSessionToken } from './local-session-storage'

vi.mock('./local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

describe('hasUserPermission', () => {
  beforeEach(() => {
    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    globalThis.window.api = {
      hasPermission: vi.fn().mockResolvedValue(true)
    } as never
  })

  it('returns false when no session token is stored', async () => {
    vi.mocked(getLocalSessionToken).mockReturnValue(null)

    expect(await hasUserPermission('participants-overview', 'read')).toBe(false)
  })

  it('returns false when window.api is unavailable', async () => {
    globalThis.window.api = undefined as never

    expect(await hasUserPermission('participants-overview', 'read')).toBe(false)
  })

  it('forwards the permission check to the main process', async () => {
    await hasUserPermission('participants-overview', 'read')

    expect(globalThis.window.api.hasPermission).toHaveBeenCalledWith(
      'token-1',
      'participants-overview',
      'read'
    )
  })
})
