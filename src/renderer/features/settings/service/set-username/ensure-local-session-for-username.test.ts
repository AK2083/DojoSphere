import { setLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ensureLocalSessionForUsername } from './ensure-local-session-for-username'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn(),
  setLocalSessionToken: vi.fn()
}))

describe('ensureLocalSessionForUsername', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      getOsUsername: vi.fn(),
      ensureLocalSession: vi.fn()
    } as never
  })

  it('returns true when a local token already exists', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    vi.mocked(getLocalSessionToken).mockReturnValue('existing-token')

    await expect(ensureLocalSessionForUsername()).resolves.toBe(true)
    expect(globalThis.window.api.getOsUsername).not.toHaveBeenCalled()
  })

  it('bootstraps a local session from the os username', async () => {
    const { getLocalSessionToken } =
      await import('@features/authentication/service/local-session-storage')
    vi.mocked(getLocalSessionToken).mockReturnValue(null)
    vi.mocked(globalThis.window.api.getOsUsername).mockResolvedValue('TestUser')
    vi.mocked(globalThis.window.api.ensureLocalSession).mockResolvedValue({
      id: 'user-1',
      sessionToken: 'token-1',
      expiresAt: '2099-01-01T00:00:00.000Z'
    })

    await expect(ensureLocalSessionForUsername()).resolves.toBe(true)

    expect(globalThis.window.api.ensureLocalSession).toHaveBeenCalledWith('TestUser')
    expect(setLocalSessionToken).toHaveBeenCalledWith('token-1')
  })
})
