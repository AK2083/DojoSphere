import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useNetworkStatusStore } from './use-network-status-store'

describe('useNetworkStatusStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes online state as true', () => {
    const store = useNetworkStatusStore()

    expect(store.isOnline).toBe(true)
    expect(store.isSupabaseReachable).toBe(true)
    expect(store.isGrafanaCloudReachable).toBe(false)
  })

  it('updates online state through action', () => {
    const store = useNetworkStatusStore()

    store.setOnline(false)
    expect(store.isOnline).toBe(false)

    store.setOnline(true)
    expect(store.isOnline).toBe(true)
  })

  it('updates reachability flags independently', () => {
    const store = useNetworkStatusStore()

    store.setSupabaseReachable(false)
    store.setGrafanaCloudReachable(true)

    expect(store.isSupabaseReachable).toBe(false)
    expect(store.isGrafanaCloudReachable).toBe(true)
  })
})
