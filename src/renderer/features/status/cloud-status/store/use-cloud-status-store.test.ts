import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCloudStatusFromStorage, setCloudStatusToStorage } from '../service/cloud-status-storage'
import { useCloudStatusStore } from './use-cloud-status-store'

vi.mock('../service/cloud-status-storage', () => ({
  getCloudStatusFromStorage: vi.fn(),
  setCloudStatusToStorage: vi.fn()
}))

describe('useCloudStatusStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('initializes from storage value when present', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(false)

    const store = useCloudStatusStore()

    expect(store.isCloudUsed).toBe(false)
  })

  it('falls back to enabled cloud mode when storage is empty', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(null)

    const store = useCloudStatusStore()

    expect(store.isCloudUsed).toBe(true)
  })

  it('persists cloud mode when setCloudUsed is called', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(true)
    const store = useCloudStatusStore()

    store.setCloudUsed(false)

    expect(store.isCloudUsed).toBe(false)
    expect(setCloudStatusToStorage).toHaveBeenCalledWith(false)
  })
})
