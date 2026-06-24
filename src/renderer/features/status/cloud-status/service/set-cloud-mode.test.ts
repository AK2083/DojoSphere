import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation } from '../monitoring/monitoring'
import { useCloudStatusStore } from '../store/use-cloud-status-store'
import { setCloudStatusToStorage } from './cloud-status-storage'
import { setCloudMode } from './set-cloud-mode'

vi.mock('./cloud-status-storage', () => ({
  getCloudStatusFromStorage: vi.fn(() => false),
  setCloudStatusToStorage: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    TOGGLE_CHANGED: 'cloud.status.toggle.changed'
  }
}))

describe('setCloudMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('updates store and persists cloud mode', () => {
    setCloudMode(true)

    expect(useCloudStatusStore().isCloudUsed).toBe(true)
    expect(setCloudStatusToStorage).toHaveBeenCalledWith(true)
    expect(monitorInformation).toHaveBeenCalledWith('cloud.status.toggle.changed', {
      enabled: true
    })
  })

  it('skips work when cloud mode is unchanged', () => {
    useCloudStatusStore().setCloudUsed(true)
    vi.clearAllMocks()

    setCloudMode(true)

    expect(setCloudStatusToStorage).not.toHaveBeenCalled()
    expect(monitorInformation).not.toHaveBeenCalled()
  })
})
