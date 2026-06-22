import { getStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCloudStatusFromStorage, setCloudStatusToStorage } from './cloud-status-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

describe('cloud-status storage', () => {
  const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads cloud status from storage', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    const result = getCloudStatusFromStorage()

    expect(result).toBe(true)
    expect(getStorageItem).toHaveBeenCalledWith(CLOUD_STATUS_KEY)
  })

  it('writes cloud status to storage', () => {
    setCloudStatusToStorage(false)

    expect(setStorageItem).toHaveBeenCalledWith(CLOUD_STATUS_KEY, false)
  })
})
