import { getCurrentSession as getCurrentSessionLowLevel } from '@shared/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentSession } from './get-current-session'

vi.mock('@shared/api')

describe('getCurrentSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns current session from low-level api facade', async () => {
    const session = { user: { id: 'user-1' } }

    vi.mocked(getCurrentSessionLowLevel).mockResolvedValue(session as never)

    const result = await getCurrentSession()

    expect(getCurrentSessionLowLevel).toHaveBeenCalledTimes(1)
    expect(result).toEqual(session)
  })

  it('returns null when no session exists', async () => {
    vi.mocked(getCurrentSessionLowLevel).mockResolvedValue(null)

    const result = await getCurrentSession()

    expect(getCurrentSessionLowLevel).toHaveBeenCalledTimes(1)
    expect(result).toBeNull()
  })
})
