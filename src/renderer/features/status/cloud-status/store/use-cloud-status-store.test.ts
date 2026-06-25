import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasSupabaseAuthSessionInStorage } from '../service/cloud-status-storage'
import { useCloudStatusStore } from './use-cloud-status-store'

vi.mock('../service/cloud-status-storage', () => ({
  hasSupabaseAuthSessionInStorage: vi.fn()
}))

describe('useCloudStatusStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('initializes from supabase auth storage when present', () => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(false)

    const store = useCloudStatusStore()

    expect(store.isCloudUsed).toBe(false)
  })

  it('initializes as cloud active when supabase auth storage has a session', () => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(true)

    const store = useCloudStatusStore()

    expect(store.isCloudUsed).toBe(true)
  })

  it('updates in-memory cloud usage when setCloudUsed is called', () => {
    vi.mocked(hasSupabaseAuthSessionInStorage).mockReturnValue(true)
    const store = useCloudStatusStore()

    store.setCloudUsed(false)

    expect(store.isCloudUsed).toBe(false)
  })
})
