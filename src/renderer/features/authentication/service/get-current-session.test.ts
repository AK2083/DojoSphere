import { getCurrentSession as getCurrentSessionLowLevel } from '@shared/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentSession } from './get-current-session'
import { resolveLocalAuthSession } from './resolve-local-auth-session'

vi.mock('@shared/api', () => ({
  getCurrentSession: vi.fn()
}))

vi.mock('./resolve-local-auth-session', () => ({
  resolveLocalAuthSession: vi.fn()
}))

describe('getCurrentSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns current session from low-level api facade', async () => {
    const session = { user: { id: 'user-1' } }

    vi.mocked(getCurrentSessionLowLevel).mockResolvedValue(session as never)

    const result = await getCurrentSession()

    expect(getCurrentSessionLowLevel).toHaveBeenCalledTimes(1)
    expect(resolveLocalAuthSession).not.toHaveBeenCalled()
    expect(result).toEqual(session)
  })

  it('falls back to a validated local session when Supabase has none', async () => {
    const localSession = { user: { id: 'local-user' } }

    vi.mocked(getCurrentSessionLowLevel).mockResolvedValue(null)
    vi.mocked(resolveLocalAuthSession).mockResolvedValue(localSession as never)

    const result = await getCurrentSession()

    expect(resolveLocalAuthSession).toHaveBeenCalledTimes(1)
    expect(result).toEqual(localSession)
  })

  it('returns null when neither cloud nor local session exists', async () => {
    vi.mocked(getCurrentSessionLowLevel).mockResolvedValue(null)
    vi.mocked(resolveLocalAuthSession).mockResolvedValue(null)

    const result = await getCurrentSession()

    expect(result).toBeNull()
  })
})
