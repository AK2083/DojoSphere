import { notifyLocalAuthStateChanged } from '@features/authentication/service/local-auth-state'
import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { resolveLocalAuthSession } from '@features/authentication/service/resolve-local-auth-session'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { updateDisplayName } from './update-display-name'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

vi.mock('@features/authentication/service/resolve-local-auth-session', () => ({
  resolveLocalAuthSession: vi.fn()
}))

vi.mock('@features/authentication/service/local-auth-state', () => ({
  notifyLocalAuthStateChanged: vi.fn()
}))

describe('updateDisplayName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      updateUserDisplayName: vi.fn()
    } as never
  })

  it('updates the display name and refreshes local auth state', async () => {
    const updatedUser = {
      id: 'user-1',
      displayName: 'Grace Hopper',
      email: null,
      userType: 'local' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    }
    const session = { user: { id: 'user-1' } }

    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    vi.mocked(globalThis.window.api.updateUserDisplayName).mockResolvedValue(updatedUser)
    vi.mocked(resolveLocalAuthSession).mockResolvedValue(session as never)

    const result = await updateDisplayName('Grace Hopper')

    expect(globalThis.window.api.updateUserDisplayName).toHaveBeenCalledWith(
      'token-1',
      'Grace Hopper'
    )
    expect(resolveLocalAuthSession).toHaveBeenCalled()
    expect(notifyLocalAuthStateChanged).toHaveBeenCalledWith(session)
    expect(result).toEqual(updatedUser)
  })

  it('throws when no local session token exists', async () => {
    vi.mocked(getLocalSessionToken).mockReturnValue(null)

    await expect(updateDisplayName('Grace Hopper')).rejects.toThrow('No local session')
  })
})
