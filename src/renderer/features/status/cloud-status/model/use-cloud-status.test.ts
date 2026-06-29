import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasSupabaseAuthSessionInStorage } from '../service/cloud-status-storage'
import { useCloudStatus } from './use-cloud-status'

vi.mock('../service/cloud-status-storage', () => ({
  hasSupabaseAuthSessionInStorage: vi.fn(() => true)
}))

describe('useCloudStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('returns reactive cloud status from store', () => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(true)
    const result = useCloudStatus()

    expect(result.isCloudUsed.value).toBe(true)
  })
})
