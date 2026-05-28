import { getStorageItem, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { getCloudStatusFromStorage, setCloudStatusToStorage } from './cloud-status-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    STORAGE_READ: 'cloud.status.storage.read',
    STORAGE_WRITE: 'cloud.status.storage.write'
  }
}))

describe('cloud-status storage', () => {
  const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads cloud status from storage and logs a breadcrumb', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    const result = getCloudStatusFromStorage()

    expect(result).toBe(true)
    expect(getStorageItem).toHaveBeenCalledWith(CLOUD_STATUS_KEY)
    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_READ, {
      value: true
    })
  })

  it('writes cloud status to storage and logs a breadcrumb', () => {
    setCloudStatusToStorage(false)

    expect(setStorageItem).toHaveBeenCalledWith(CLOUD_STATUS_KEY, false)
    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.STORAGE_WRITE, {
      isCloudUsed: false
    })
  })
})
