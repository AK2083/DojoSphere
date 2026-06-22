import { getStorageItem, removeStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearRegisterEmailFromStorage, getRegisterEmailFromStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  removeStorageItem: vi.fn()
}))

describe('confirm-user register-storage (unit)', () => {
  const EMAILKEY = 'dojosphere.auth.register.email'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads registration email from storage', () => {
    vi.mocked(getStorageItem).mockReturnValue('user@test.com')

    const result = getRegisterEmailFromStorage()

    expect(getStorageItem).toHaveBeenCalledWith(EMAILKEY)
    expect(result).toBe('user@test.com')
  })

  it('returns null when no registration email exists', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getRegisterEmailFromStorage()

    expect(result).toBeNull()
  })

  it('clears the registration email from storage', () => {
    clearRegisterEmailFromStorage()

    expect(removeStorageItem).toHaveBeenCalledWith(EMAILKEY)
    expect(removeStorageItem).toHaveBeenCalledTimes(1)
  })
})
