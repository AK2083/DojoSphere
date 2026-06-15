import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/api', () => ({
  heartbeat: vi.fn()
}))

vi.mock('@shared/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/lib')>()

  return {
    ...actual,
    captureException: vi.fn()
  }
})

function setNavigatorOnline(online: boolean) {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    configurable: true,
    value: online
  })
}

async function loadNetworkStatusModel() {
  vi.resetModules()
  const pinia = await import('pinia')
  pinia.setActivePinia(pinia.createPinia())

  const networkStatusModel = await import('./network-status')
  const api = await import('@shared/api')
  const logging = await import('@shared/lib')
  const stores = await import('@shared/store/network')
  const cloudStatus = await import('@features/status')

  return { networkStatusModel, api, logging, stores, cloudStatus }
}

async function loadNetworkStatusModelWithoutActiveStore() {
  vi.resetModules()
  const pinia = await import('pinia')
  pinia.setActivePinia(undefined)

  const networkStatusModel = await import('./network-status')

  return { networkStatusModel }
}

describe('shared network status model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    setNavigatorOnline(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns success for heartbeat with ok status', async () => {
    const { networkStatusModel, api, logging } = await loadNetworkStatusModel()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await networkStatusModel.checkHeartbeatConnectivity()

    expect(result).toStrictEqual({ success: true })
    expect(logging.captureException).not.toHaveBeenCalled()
  }, 10_000)

  it('maps heartbeat errors to retry when browser is offline', async () => {
    const { networkStatusModel, api, logging } = await loadNetworkStatusModel()
    setNavigatorOnline(false)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: null,
      error: new Error('Any error')
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await networkStatusModel.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.retry')
    }
    expect(logging.captureException).not.toHaveBeenCalled()
  }, 10_000)

  it('captures unknown heartbeat errors when browser is online', async () => {
    const { networkStatusModel, api, logging } = await loadNetworkStatusModel()
    setNavigatorOnline(true)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: null,
      error: new Error('unexpected')
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await networkStatusModel.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(logging.captureException).toHaveBeenCalledTimes(1)
  })

  it('captures invalid payload responses as unknown', async () => {
    const { networkStatusModel, api, logging } = await loadNetworkStatusModel()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'down', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await networkStatusModel.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(logging.captureException).toHaveBeenCalledTimes(1)
  })

  it('initializes stores and browser listeners on bootstrap', async () => {
    const { networkStatusModel, api, stores, cloudStatus } = await loadNetworkStatusModel()
    const addListenerSpy = vi.spyOn(globalThis.window, 'addEventListener')
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await networkStatusModel.bootstrapNetworkStatus()

    const networkStore = stores.useNetworkStatusStore()
    const cloudStore = cloudStatus.useCloudStatusStore()
    expect(networkStore.isOnline).toBe(true)
    expect(cloudStore.isCloudUsed).toBe(true)

    const onlineHandler = addListenerSpy.mock.calls.find((args) => args[0] === 'online')?.[1]
    const offlineHandler = addListenerSpy.mock.calls.find((args) => args[0] === 'offline')?.[1]
    expect(onlineHandler).toBeDefined()
    expect(offlineHandler).toBeDefined()

    setNavigatorOnline(false)
    ;(offlineHandler as (event: unknown) => void)(new globalThis.Event('offline'))
    expect(networkStore.isOnline).toBe(false)
    expect(cloudStore.isCloudUsed).toBe(true)

    setNavigatorOnline(true)
    ;(onlineHandler as (event: unknown) => void)(new globalThis.Event('online'))
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))
    expect(networkStore.isOnline).toBe(true)
    expect(cloudStore.isCloudUsed).toBe(true)
  })

  it('does not bootstrap twice', async () => {
    const { networkStatusModel, api } = await loadNetworkStatusModel()
    const addListenerSpy = vi.spyOn(globalThis.window, 'addEventListener')
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await networkStatusModel.bootstrapNetworkStatus()
    addListenerSpy.mockClear()
    vi.mocked(api.heartbeat).mockClear()

    await networkStatusModel.bootstrapNetworkStatus()

    expect(addListenerSpy).not.toHaveBeenCalled()
    expect(api.heartbeat).not.toHaveBeenCalled()
  })

  it('sets only network store offline when recheck runs without internet', async () => {
    const { networkStatusModel, api, stores, cloudStatus } = await loadNetworkStatusModel()
    setNavigatorOnline(false)

    const reachable = await networkStatusModel.recheckNetworkStatusAfterFailedUserAction()

    expect(reachable).toBe(false)
    expect(api.heartbeat).not.toHaveBeenCalled()
    expect(stores.useNetworkStatusStore().isOnline).toBe(false)
    expect(cloudStatus.useCloudStatusStore().isCloudUsed).toBe(true)
  })

  it('updates network store from heartbeat result when internet is available', async () => {
    const { networkStatusModel, api, stores, cloudStatus } = await loadNetworkStatusModel()
    setNavigatorOnline(true)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const reachable = await networkStatusModel.recheckNetworkStatusAfterFailedUserAction()

    expect(reachable).toBe(true)
    expect(stores.useNetworkStatusStore().isOnline).toBe(true)
    expect(cloudStatus.useCloudStatusStore().isCloudUsed).toBe(true)
  })

  it('exposes reactive refs from both stores', async () => {
    const { networkStatusModel, stores, cloudStatus } = await loadNetworkStatusModel()
    const networkStore = stores.useNetworkStatusStore()
    const cloudStore = cloudStatus.useCloudStatusStore()
    networkStore.setOnline(false)
    cloudStore.setCloudUsed(false)

    const state = networkStatusModel.useNetworkStatusState()

    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(false)
  })

  it('returns navigator fallback refs when no active store exists', async () => {
    setNavigatorOnline(false)
    const { networkStatusModel } = await loadNetworkStatusModelWithoutActiveStore()

    const state = networkStatusModel.useNetworkStatusState()

    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(true)
  })

  it('handles non-browser runtime in bootstrap without listeners', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('navigator', undefined)
    const { networkStatusModel, api } = await loadNetworkStatusModel()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await expect(networkStatusModel.bootstrapNetworkStatus()).resolves.toBeUndefined()
    expect(api.heartbeat).not.toHaveBeenCalled()
  })
})
