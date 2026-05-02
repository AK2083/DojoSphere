import { getCurrentUser, type UserResponse } from '@shared/api'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentUserState } from './get-current-user'

vi.mock('@shared/api')
vi.mock('@shared/lib')

describe('getCurrentUserState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user from api response', async () => {
    const user = { id: 'user-1' }
    vi.mocked(getCurrentUser).mockResolvedValue({
      data: { user },
      error: null
    } as unknown as UserResponse)

    const result = await getCurrentUserState()

    expect(result).toEqual({
      data: { user },
      error: null
    })
  })

  it('returns null user fallback when api user is undefined', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      data: { user: undefined },
      error: null
    } as unknown as UserResponse)

    const result = await getCurrentUserState()

    expect(result).toEqual({
      data: { user: null },
      error: null
    })
  })

  it('captures exception and returns error response on failure', async () => {
    const error = new Error('fetch failed')

    vi.mocked(getCurrentUser).mockResolvedValue({
      data: { user: null },
      error
    } as unknown as UserResponse)

    const result = await getCurrentUserState()

    expect(captureException).toHaveBeenCalledWith(error, 'auth', 'getCurrentUser')
    expect(result).toEqual({
      data: { user: null },
      error
    })
  })
})
