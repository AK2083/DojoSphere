import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ensureLocalSessionFromOsUsername } from './ensure-local-session'
import { getCurrentSession } from './get-current-session'
import { notifyLocalAuthStateChanged } from './local-auth-state'
import { getLocalSessionToken } from './local-session-storage'

vi.mock('@shared/lib', () => ({
  setUserContext: vi.fn()
}))

vi.mock('./get-current-session', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('./local-auth-state', () => ({
  notifyLocalAuthStateChanged: vi.fn()
}))

describe('ensureLocalSessionFromOsUsername', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.localStorage.clear()
    globalThis.window.api = {
      getUsers: vi.fn(),
      addUser: vi.fn(),
      ensureLocalSession: vi.fn(),
      getLocalSession: vi.fn(),
      revokeLocalSession: vi.fn(),
      updateUserDisplayName: vi.fn(),
      dbHealthcheck: vi.fn(),
      checkGrafanaCloudReachability: vi.fn(),
      auditRecord: vi.fn(),
      getOsUsername: vi.fn()
    }
  })

  it('returns true when a session already exists', async () => {
    const session = { user: { id: 'user-1', app_metadata: { provider: 'local' } } }
    vi.mocked(getCurrentSession).mockResolvedValue(session as never)

    await expect(ensureLocalSessionFromOsUsername()).resolves.toBe(true)

    expect(globalThis.window.api.getOsUsername).not.toHaveBeenCalled()
    expect(globalThis.window.api.ensureLocalSession).not.toHaveBeenCalled()
  })

  it('returns false when the OS username is empty', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)
    vi.mocked(globalThis.window.api.getOsUsername).mockResolvedValue('   ')

    await expect(ensureLocalSessionFromOsUsername()).resolves.toBe(false)

    expect(globalThis.window.api.ensureLocalSession).not.toHaveBeenCalled()
  })

  it('returns false when no session token is returned', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)
    vi.mocked(globalThis.window.api.getOsUsername).mockResolvedValue('TestUser')
    vi.mocked(globalThis.window.api.ensureLocalSession).mockResolvedValue({
      id: 'user-1',
      sessionToken: '',
      expiresAt: '2099-01-01T00:00:00.000Z'
    })

    await expect(ensureLocalSessionFromOsUsername()).resolves.toBe(false)

    expect(getLocalSessionToken()).toBeNull()
    expect(notifyLocalAuthStateChanged).not.toHaveBeenCalled()
  })

  it('persists the session token and notifies auth listeners', async () => {
    const session = { user: { id: 'user-1', app_metadata: { provider: 'local' } } }

    vi.mocked(getCurrentSession)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(session as never)
    vi.mocked(globalThis.window.api.getOsUsername).mockResolvedValue('TestUser')
    vi.mocked(globalThis.window.api.ensureLocalSession).mockResolvedValue({
      id: 'user-1',
      sessionToken: 'token-123',
      expiresAt: '2099-01-01T00:00:00.000Z'
    })

    await expect(ensureLocalSessionFromOsUsername()).resolves.toBe(true)

    expect(globalThis.window.api.ensureLocalSession).toHaveBeenCalledWith('TestUser')
    expect(getLocalSessionToken()).toBe('token-123')
    expect(notifyLocalAuthStateChanged).toHaveBeenCalledWith(session)
  })

  it('returns false when session resolution fails after bootstrap', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null)
    vi.mocked(globalThis.window.api.getOsUsername).mockResolvedValue('TestUser')
    vi.mocked(globalThis.window.api.ensureLocalSession).mockResolvedValue({
      id: 'user-1',
      sessionToken: 'token-123',
      expiresAt: '2099-01-01T00:00:00.000Z'
    })

    await expect(ensureLocalSessionFromOsUsername()).resolves.toBe(false)
    expect(getLocalSessionToken()).toBe('token-123')
  })
})
