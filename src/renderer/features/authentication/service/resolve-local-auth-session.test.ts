import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getLocalSessionToken, setLocalSessionToken } from './local-session-storage'
import { resolveLocalAuthSession, revokeLocalAuthSession } from './resolve-local-auth-session'

describe('resolveLocalAuthSession', () => {
  beforeEach(() => {
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
      getCompetitors: vi.fn(),
      addCompetitor: vi.fn(),
      updateCompetitor: vi.fn(),
      deleteCompetitor: vi.fn(),
      getOsUsername: vi.fn()
    }
  })

  it('returns null when no token is stored', async () => {
    await expect(resolveLocalAuthSession()).resolves.toBeNull()
  })

  it('returns null when window.api is unavailable', async () => {
    setLocalSessionToken('token-1')
    Object.defineProperty(globalThis.window, 'api', {
      configurable: true,
      value: undefined
    })

    await expect(resolveLocalAuthSession()).resolves.toBeNull()
  })

  it('maps a valid local session from ipc', async () => {
    setLocalSessionToken('token-1')
    vi.mocked(globalThis.window.api.getLocalSession).mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
      user: {
        id: 'user-1',
        displayName: 'Ada Lovelace',
        email: null,
        userType: 'local',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: null
      }
    })

    const session = await resolveLocalAuthSession()

    expect(session?.user.id).toBe('user-1')
    expect(session?.user.app_metadata).toEqual({ provider: 'local' })
  })

  it('clears storage when ipc validation fails', async () => {
    setLocalSessionToken('token-1')
    vi.mocked(globalThis.window.api.getLocalSession).mockResolvedValue(null)

    await expect(resolveLocalAuthSession()).resolves.toBeNull()
    expect(getLocalSessionToken()).toBeNull()
  })

  it('clears storage when ipc throws', async () => {
    setLocalSessionToken('token-1')
    vi.mocked(globalThis.window.api.getLocalSession).mockRejectedValue(new Error('boom'))

    await expect(resolveLocalAuthSession()).resolves.toBeNull()
    expect(getLocalSessionToken()).toBeNull()
  })
})

describe('revokeLocalAuthSession', () => {
  beforeEach(() => {
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
      getCompetitors: vi.fn(),
      addCompetitor: vi.fn(),
      updateCompetitor: vi.fn(),
      deleteCompetitor: vi.fn(),
      getOsUsername: vi.fn()
    }
  })

  it('clears storage even when no token exists', async () => {
    await revokeLocalAuthSession()

    expect(globalThis.window.api.revokeLocalSession).not.toHaveBeenCalled()
    expect(getLocalSessionToken()).toBeNull()
  })

  it('revokes the token through ipc and clears storage', async () => {
    setLocalSessionToken('token-1')

    await revokeLocalAuthSession()

    expect(globalThis.window.api.revokeLocalSession).toHaveBeenCalledWith('token-1')
    expect(getLocalSessionToken()).toBeNull()
  })

  it('clears storage when revoke ipc is unavailable', async () => {
    setLocalSessionToken('token-1')
    Object.defineProperty(globalThis.window, 'api', {
      configurable: true,
      value: {
        getLocalSession: vi.fn()
      }
    })

    await revokeLocalAuthSession()

    expect(globalThis.localStorage.getItem('dojosphere.auth.local.session')).toBeNull()
  })

  it('clears storage when revoke ipc throws', async () => {
    setLocalSessionToken('token-1')
    vi.mocked(globalThis.window.api.revokeLocalSession).mockRejectedValue(new Error('boom'))

    await expect(revokeLocalAuthSession()).rejects.toThrow('boom')
    expect(getLocalSessionToken()).toBeNull()
  })
})
