import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentSession } from '../../service/get-current-session'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { getLocalSessionToken } from '../../service/local-session-storage'
import { signInLocally } from './sign-in-locally'

vi.mock('@shared/lib', () => ({
  setUserContext: vi.fn()
}))

vi.mock('../../service/get-current-session', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('../../service/local-auth-state', () => ({
  notifyLocalAuthStateChanged: vi.fn()
}))

describe('signInLocally', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.localStorage.clear()
    globalThis.window.api = {
      getUsers: vi.fn(),
      addUser: vi.fn(),
      getLocalSession: vi.fn(),
      revokeLocalSession: vi.fn(),
      dbHealthcheck: vi.fn(),
      getOsUsername: vi.fn()
    }
  })

  it('returns false when no session token is returned', async () => {
    vi.mocked(globalThis.window.api.addUser).mockResolvedValue({ id: 'user-1' })

    await expect(signInLocally('Ada Lovelace')).resolves.toBe(false)
    expect(getLocalSessionToken()).toBeNull()
    expect(notifyLocalAuthStateChanged).not.toHaveBeenCalled()
  })

  it('persists the session token and notifies auth listeners', async () => {
    const session = { user: { id: 'user-1', app_metadata: { provider: 'local' } } }

    vi.mocked(globalThis.window.api.addUser).mockResolvedValue({
      id: 'user-1',
      sessionToken: 'token-123'
    })
    vi.mocked(getCurrentSession).mockResolvedValue(session as never)

    await expect(signInLocally('Ada Lovelace')).resolves.toBe(true)

    expect(globalThis.window.api.addUser).toHaveBeenCalledWith({
      displayName: 'Ada Lovelace',
      userType: 'local'
    })
    expect(getLocalSessionToken()).toBe('token-123')
    expect(notifyLocalAuthStateChanged).toHaveBeenCalledWith(session)
  })

  it('returns false when session resolution fails after sign-in', async () => {
    vi.mocked(globalThis.window.api.addUser).mockResolvedValue({
      id: 'user-1',
      sessionToken: 'token-123'
    })
    vi.mocked(getCurrentSession).mockResolvedValue(null)

    await expect(signInLocally('Ada Lovelace')).resolves.toBe(false)
    expect(getLocalSessionToken()).toBe('token-123')
  })
})
