import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCloudStatusFromStorage } from '../service/cloud-status-storage'
import { useCloudStatus } from './use-cloud-status'

vi.mock('../service/cloud-status-storage', () => ({
  getCloudStatusFromStorage: vi.fn(() => true),
  setCloudStatusToStorage: vi.fn()
}))

describe('useCloudStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('returns reactive cloud status from store', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(true)
    const result = useCloudStatus()

    expect(result.isCloudUsed.value).toBe(true)
  })

  it('toggles cloud status through store action', () => {
    vi.mocked(getCloudStatusFromStorage).mockReturnValue(true)
    const result = useCloudStatus()

    result.toggleCloudUsed()

    expect(result.isCloudUsed.value).toBe(false)
  })
})
