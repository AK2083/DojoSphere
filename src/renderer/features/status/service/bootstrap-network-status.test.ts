import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { monitorDebug, monitorInformation, monitorWarning } = vi.hoisted(() => ({
  monitorDebug: vi.fn(),
  monitorInformation: vi.fn(),
  monitorWarning: vi.fn()
}))

vi.mock('@shared/api', () => ({
  heartbeat: vi.fn()
}))

vi.mock('./check-grafana-cloud-reachability', () => ({
  checkGrafanaCloudReachability: vi.fn().mockResolvedValue({
    reachable: false,
    reason: 'not_configured'
  })
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorDebug,
  monitorInformation,
  monitorWarning,
  monitorError: vi.fn(),
  MONITORING_EVENTS: {
    BOOTSTRAP_STARTED: 'network.status.bootstrap.started',
    BOOTSTRAP_SKIPPED: 'network.status.bootstrap.skipped',
    BOOTSTRAP_COMPLETED: 'network.status.bootstrap.completed',
    CONNECTIVITY_OFFLINE: 'network.status.connectivity.offline',
    CONNECTIVITY_ONLINE: 'network.status.connectivity.online',
    HEARTBEAT_CHECK_STARTED: 'network.status.heartbeat.started',
    HEARTBEAT_CHECK_FAILED: 'network.status.heartbeat.failed',
    HEARTBEAT_CHECK_SUCCEEDED: 'network.status.heartbeat.succeeded',
    RECHECK_AFTER_FAILED_ACTION: 'network.status.recheck.after_failed_action'
  }
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

async function loadBootstrapModule() {
  vi.resetModules()
  const pinia = await import('pinia')
  pinia.setActivePinia(pinia.createPinia())

  const bootstrap = await import('./bootstrap-network-status')
  const api = await import('@shared/api')
  const grafana = await import('./check-grafana-cloud-reachability')
  const logging = await import('@shared/lib')
  const statusState = await import('../model/use-status-state')
  const networkStore = await import('../network-status/store/use-network-status-store')
  const cloudStore = await import('../cloud-status/store/use-cloud-status-store')

  return { bootstrap, api, grafana, logging, statusState, networkStore, cloudStore }
}

async function loadStatusStateWithoutActiveStore() {
  vi.resetModules()
  const pinia = await import('pinia')
  pinia.setActivePinia(undefined)

  const statusState = await import('../model/use-status-state')

  return { statusState }
}

describe('bootstrapNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    setNavigatorOnline(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns success for heartbeat with ok status', async () => {
    const { bootstrap, api, logging } = await loadBootstrapModule()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await bootstrap.checkHeartbeatConnectivity()

    expect(result).toStrictEqual({ success: true })
    expect(logging.captureException).not.toHaveBeenCalled()
  }, 10_000)

  it('maps heartbeat errors to retry when browser is offline', async () => {
    const { bootstrap, api, logging } = await loadBootstrapModule()
    setNavigatorOnline(false)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: null,
      error: new Error('Any error')
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await bootstrap.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.retry')
    }
    expect(logging.captureException).not.toHaveBeenCalled()
  }, 10_000)

  it('captures unknown heartbeat errors when browser is online', async () => {
    const { bootstrap, api, logging } = await loadBootstrapModule()
    setNavigatorOnline(true)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: null,
      error: new Error('unexpected')
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await bootstrap.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(logging.captureException).toHaveBeenCalledTimes(1)
  })

  it('captures invalid payload responses as unknown', async () => {
    const { bootstrap, api, logging } = await loadBootstrapModule()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'down', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const result = await bootstrap.checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(logging.captureException).toHaveBeenCalledTimes(1)
  })

  it('tracks Supabase and Grafana reachability separately during bootstrap', async () => {
    const { bootstrap, api, grafana, networkStore } = await loadBootstrapModule()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)
    vi.mocked(grafana.checkGrafanaCloudReachability).mockResolvedValue({
      reachable: false,
      reason: 'request_failed'
    })

    await bootstrap.bootstrapNetworkStatus()

    const store = networkStore.useNetworkStatusStore()
    expect(store.isSupabaseReachable).toBe(true)
    expect(store.isGrafanaCloudReachable).toBe(false)
    expect(store.isOnline).toBe(true)
  })

  it('initializes stores and browser listeners on bootstrap', async () => {
    const { bootstrap, api, networkStore, cloudStore } = await loadBootstrapModule()
    const addListenerSpy = vi.spyOn(globalThis.window, 'addEventListener')
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await bootstrap.bootstrapNetworkStatus()

    const networkStatusStore = networkStore.useNetworkStatusStore()
    const cloudStatusStore = cloudStore.useCloudStatusStore()
    expect(networkStatusStore.isOnline).toBe(true)
    expect(cloudStatusStore.isCloudUsed).toBe(true)

    const onlineHandler = addListenerSpy.mock.calls.find((args) => args[0] === 'online')?.[1]
    const offlineHandler = addListenerSpy.mock.calls.find((args) => args[0] === 'offline')?.[1]
    expect(onlineHandler).toBeDefined()
    expect(offlineHandler).toBeDefined()

    setNavigatorOnline(false)
    ;(offlineHandler as (event: unknown) => void)(new globalThis.Event('offline'))
    expect(networkStatusStore.isOnline).toBe(false)
    expect(networkStatusStore.isSupabaseReachable).toBe(false)
    expect(networkStatusStore.isGrafanaCloudReachable).toBe(false)
    expect(cloudStatusStore.isCloudUsed).toBe(true)

    setNavigatorOnline(true)
    ;(onlineHandler as (event: unknown) => void)(new globalThis.Event('online'))
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0))
    expect(networkStatusStore.isOnline).toBe(true)
    expect(cloudStatusStore.isCloudUsed).toBe(true)
  })

  it('does not bootstrap twice', async () => {
    const { bootstrap, api } = await loadBootstrapModule()
    const addListenerSpy = vi.spyOn(globalThis.window, 'addEventListener')
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await bootstrap.bootstrapNetworkStatus()
    addListenerSpy.mockClear()
    vi.mocked(api.heartbeat).mockClear()

    await bootstrap.bootstrapNetworkStatus()

    expect(addListenerSpy).not.toHaveBeenCalled()
    expect(api.heartbeat).not.toHaveBeenCalled()
  })

  it('sets only network store offline when recheck runs without internet', async () => {
    const { bootstrap, api, networkStore, cloudStore } = await loadBootstrapModule()
    setNavigatorOnline(false)

    const reachable = await bootstrap.recheckNetworkStatusAfterFailedUserAction()

    expect(reachable).toBe(false)
    expect(api.heartbeat).not.toHaveBeenCalled()
    expect(networkStore.useNetworkStatusStore().isOnline).toBe(false)
    expect(cloudStore.useCloudStatusStore().isCloudUsed).toBe(true)
  })

  it('updates network store from heartbeat result when internet is available', async () => {
    const { bootstrap, api, networkStore, cloudStore } = await loadBootstrapModule()
    setNavigatorOnline(true)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const reachable = await bootstrap.recheckNetworkStatusAfterFailedUserAction()

    expect(reachable).toBe(true)
    expect(networkStore.useNetworkStatusStore().isOnline).toBe(true)
    expect(cloudStore.useCloudStatusStore().isCloudUsed).toBe(true)
  })

  it('marks connectivity online after a successful heartbeat during bootstrap', async () => {
    const { bootstrap, api } = await loadBootstrapModule()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await bootstrap.bootstrapNetworkStatus()

    expect(api.heartbeat).toHaveBeenCalled()
  })

  it('keeps connectivity offline when heartbeat fails while the browser is online', async () => {
    const { bootstrap, api, networkStore } = await loadBootstrapModule()
    setNavigatorOnline(true)
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: null,
      error: new Error('backend down')
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    const reachable = await bootstrap.recheckNetworkStatusAfterFailedUserAction()

    expect(reachable).toBe(false)
    expect(networkStore.useNetworkStatusStore().isOnline).toBe(false)
  })

  it('exposes reactive refs from both stores', async () => {
    const { statusState, networkStore, cloudStore } = await loadBootstrapModule()
    const networkStatusStore = networkStore.useNetworkStatusStore()
    const cloudStatusStore = cloudStore.useCloudStatusStore()
    networkStatusStore.setOnline(false)
    cloudStatusStore.setCloudUsed(false)

    const state = statusState.useStatusState()

    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(false)
  })

  it('returns navigator fallback refs when no active store exists', async () => {
    setNavigatorOnline(false)
    const { statusState } = await loadStatusStateWithoutActiveStore()

    const state = statusState.useStatusState()

    expect(state.isOnline.value).toBe(false)
    expect(state.isCloudUsed.value).toBe(true)
  })

  it('handles non-browser runtime in bootstrap without listeners', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('navigator', undefined)
    const { bootstrap, api } = await loadBootstrapModule()
    vi.mocked(api.heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof api.heartbeat>>)

    await expect(bootstrap.bootstrapNetworkStatus()).resolves.toBeUndefined()
    expect(api.heartbeat).not.toHaveBeenCalled()
  })
})
