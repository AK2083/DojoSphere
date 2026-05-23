import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCloudStatusStore } from './use-cloud-status-store'

describe('useCloudStatusStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes cloud state as true', () => {
    const store = useCloudStatusStore()

    expect(store.isCloudUsed).toBe(true)
  })

  it('updates cloud state through action', () => {
    const store = useCloudStatusStore()

    store.setCloudUsed(false)
    expect(store.isCloudUsed).toBe(false)

    store.setCloudUsed(true)
    expect(store.isCloudUsed).toBe(true)
  })
})
