import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

function setNavigatorOnline(online: boolean) {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    configurable: true,
    value: online
  })
}

async function loadConnectivityState() {
  vi.resetModules()
  return await import('./connectivity-state')
}

describe('connectivity-state', () => {
  beforeEach(() => {
    setNavigatorOnline(true)
  })

  it('returns default refs from navigator when not bound', async () => {
    setNavigatorOnline(false)
    const { useNetworkStatusState } = await loadConnectivityState()

    const state = useNetworkStatusState()

    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(false)
    expect(state.isSupabaseReachable.value).toBe(true)
  })

  it('returns bound refs after bindConnectivityState', async () => {
    const { bindConnectivityState, useNetworkStatusState } = await loadConnectivityState()
    const isOnline = ref(false)
    const isCloudUsed = ref(false)
    const isSupabaseReachable = ref(false)

    bindConnectivityState({
      isOnline,
      isCloudUsed,
      isSupabaseReachable
    })

    const state = useNetworkStatusState()

    expect(state.isOnline).toBe(isOnline)
    expect(state.isCloudUsed).toBe(isCloudUsed)
    expect(state.isSupabaseReachable).toBe(isSupabaseReachable)
    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(false)
    expect(state.isSupabaseReachable.value).toBe(false)

    isOnline.value = true
    isCloudUsed.value = true
    isSupabaseReachable.value = true

    expect(useNetworkStatusState().isOnline.value).toBe(true)
    expect(useNetworkStatusState().isCloudUsed.value).toBe(true)
    expect(useNetworkStatusState().isSupabaseReachable.value).toBe(true)
  })
})
