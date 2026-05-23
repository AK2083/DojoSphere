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
  })

  it('updates online state through action', () => {
    const store = useNetworkStatusStore()

    store.setOnline(false)
    expect(store.isOnline).toBe(false)

    store.setOnline(true)
    expect(store.isOnline).toBe(true)
  })
})
