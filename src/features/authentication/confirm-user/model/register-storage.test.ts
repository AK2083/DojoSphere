import { getStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { getRegisterEmailFromStorage } from './register-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    STORAGE_REGISTER_EMAIL_WRITE: 'auth.register.email.storage.write'
  }
}))

describe('confirm-user register-storage (unit)', () => {
  const EMAILKEY = 'dojosphere.auth.register.email'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads registration email from storage and logs event', () => {
    vi.mocked(getStorageItem).mockReturnValue('user@test.com')

    const result = getRegisterEmailFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith(
      MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_WRITE,
      {
        EMAILKEY
      }
    )
    expect(getStorageItem).toHaveBeenCalledWith(EMAILKEY)
    expect(result).toBe('user@test.com')
  })

  it('returns null when no registration email exists', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getRegisterEmailFromStorage()

    expect(result).toBeNull()
  })
})
