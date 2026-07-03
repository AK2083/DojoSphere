import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasUserPermission } from './has-user-permission'
import { clearLocalSessionToken, getLocalSessionToken } from './local-session-storage'

vi.mock('./local-session-storage', () => ({
  getLocalSessionToken: vi.fn(),
  clearLocalSessionToken: vi.fn()
}))

describe('hasUserPermission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('returns false and clears a stale session token when IPC reports unauthorized', async () => {
    vi.mocked(globalThis.window.api.hasPermission).mockRejectedValue(
      new Error("Error invoking remote method 'authorization:hasPermission': Error: Unauthorized")
    )

    expect(await hasUserPermission('participants-overview', 'read')).toBe(false)
    expect(clearLocalSessionToken).toHaveBeenCalledTimes(1)
  })

  it('rethrows unexpected IPC errors', async () => {
    vi.mocked(globalThis.window.api.hasPermission).mockRejectedValue(new Error('network failed'))

    await expect(hasUserPermission('participants-overview', 'read')).rejects.toThrow(
      'network failed'
    )
    expect(clearLocalSessionToken).not.toHaveBeenCalled()
  })

  it('rethrows non-error rejections from IPC', async () => {
    vi.mocked(globalThis.window.api.hasPermission).mockRejectedValue('offline')

    await expect(hasUserPermission('participants-overview', 'read')).rejects.toBe('offline')
    expect(clearLocalSessionToken).not.toHaveBeenCalled()
  })
})
