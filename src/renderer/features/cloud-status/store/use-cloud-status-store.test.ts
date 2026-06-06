import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { getCloudStatusFromStorage, setCloudStatusToStorage } from '../service/cloud-status-storage'
import { useCloudStatusStore } from './use-cloud-status-store'

vi.mock('../service/cloud-status-storage', () => ({
  getCloudStatusFromStorage: vi.fn(),
  setCloudStatusToStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    TOGGLED: 'cloud.status.toggled'
  }
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

  it('toggles cloud mode and logs breadcrumb', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(true)
    const store = useCloudStatusStore()

    store.toggleCloudUsed()

    expect(store.isCloudUsed).toBe(false)
    expect(setCloudStatusToStorage).toHaveBeenCalledWith(false)
    expect(monitorInformation).toHaveBeenCalledWith(MONITORING_EVENTS.TOGGLED, {
      isCloudUsed: false
    })
  })
})
