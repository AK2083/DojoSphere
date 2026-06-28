import { mapSupabaseError, updateUserPassword } from '@shared/api'
import { AppError } from '@shared/errors'
import { logError } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setNewPassword } from './set-new-password'

vi.mock('@shared/api')
vi.mock('@shared/lib', () => ({
  logError: vi.fn()
}))

describe('setNewPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when password update succeeds', async () => {
    vi.mocked(updateUserPassword).mockResolvedValue({
      data: { user: null },
      error: null
    } as never)

    const result = await setNewPassword('new-password-123')

    expect(result).toEqual({ success: true })
    expect(updateUserPassword).toHaveBeenCalledWith('new-password-123')
    expect(mapSupabaseError).not.toHaveBeenCalled()
    expect(logError).not.toHaveBeenCalled()
  })

  it('maps and reports error when password update fails', async () => {
    const supabaseError = {
      name: 'AuthError',
      message: 'Weak password',
      code: 'auth.weak_password',
      status: 400
    }
    const mappedError = new AppError('auth.weak_password', 'Weak password')

    vi.mocked(updateUserPassword).mockResolvedValue({
      data: { user: null },
      error: supabaseError
    } as never)
    vi.mocked(mapSupabaseError).mockReturnValue(mappedError)

    const result = await setNewPassword('123')

    expect(result).toEqual({ success: false, error: mappedError })
    expect(mapSupabaseError).toHaveBeenCalledWith(supabaseError)
    expect(logError).toHaveBeenCalledWith(mappedError, 'auth', 'setNewPassword')
  })
})
