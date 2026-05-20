import { AppError } from '@shared/errors'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkHeartbeatConnectivity } from '../service/check-heartbeat'
import { useNetworkStatus } from './use-network-status'

let onMountedHandler: (() => Promise<void>) | undefined
let onUnmountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => Promise<void>) => {
      onMountedHandler = callback
    },
    onUnmounted: (callback: () => void) => {
      onUnmountedHandler = callback
    }
  }
})

vi.mock('../service/check-heartbeat', () => ({
  checkHeartbeatConnectivity: vi.fn()
}))

function setNavigatorOnline(online: boolean) {
  Object.defineProperty(globalThis.navigator, 'onLine', {
    configurable: true,
    value: online
  })
}

describe('useNetworkStatus', () => {
  beforeEach(() => {
    onUnmountedHandler?.()
    vi.clearAllMocks()
    onMountedHandler = undefined
    onUnmountedHandler = undefined
  })

  it('checks heartbeat on mount when browser is online', async () => {
    setNavigatorOnline(true)
    vi.mocked(checkHeartbeatConnectivity).mockResolvedValue({ success: true })

    const { isOnline, isCloudUsed } = useNetworkStatus()

    expect(onMountedHandler).toBeDefined()
    await onMountedHandler?.()

    expect(checkHeartbeatConnectivity).toHaveBeenCalledTimes(1)
    expect(isOnline.value).toBe(true)
    expect(isCloudUsed.value).toBe(true)
  })

  it('skips heartbeat on mount when browser is offline', async () => {
    setNavigatorOnline(false)

    const { isOnline, isCloudUsed } = useNetworkStatus()

    expect(onMountedHandler).toBeDefined()
    await onMountedHandler?.()

    expect(checkHeartbeatConnectivity).not.toHaveBeenCalled()
    expect(isOnline.value).toBe(false)
    expect(isCloudUsed.value).toBe(false)
  })

  it('reacts to offline and online browser events', async () => {
    setNavigatorOnline(true)
    vi.mocked(checkHeartbeatConnectivity).mockResolvedValue({ success: true })

    const { isOnline, isCloudUsed } = useNetworkStatus()
    await onMountedHandler?.()

    setNavigatorOnline(false)
    globalThis.window.dispatchEvent(new globalThis.Event('offline'))

    expect(isOnline.value).toBe(false)
    expect(isCloudUsed.value).toBe(false)

    setNavigatorOnline(true)
    globalThis.window.dispatchEvent(new globalThis.Event('online'))
    await Promise.resolve()

    expect(checkHeartbeatConnectivity).toHaveBeenCalledTimes(2)
    expect(isOnline.value).toBe(true)
    expect(isCloudUsed.value).toBe(true)
  })

  it('rechecks connectivity after failed user actions', async () => {
    setNavigatorOnline(true)
    vi.mocked(checkHeartbeatConnectivity)
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({
        success: false,
        error: new AppError('shared.error.retry')
      })

    const { isOnline, recheckAfterFailedUserAction } = useNetworkStatus()
    await onMountedHandler?.()

    const result = await recheckAfterFailedUserAction()

    expect(result).toBe(false)
    expect(checkHeartbeatConnectivity).toHaveBeenCalledTimes(2)
    expect(isOnline.value).toBe(false)
  })

  it('returns false after failed action recheck when browser is offline', async () => {
    setNavigatorOnline(false)
    vi.mocked(checkHeartbeatConnectivity).mockResolvedValue({ success: true })

    const { isOnline, isCloudUsed, recheckAfterFailedUserAction } = useNetworkStatus()
    await onMountedHandler?.()

    const result = await recheckAfterFailedUserAction()

    expect(result).toBe(false)
    expect(checkHeartbeatConnectivity).not.toHaveBeenCalled()
    expect(isOnline.value).toBe(false)
    expect(isCloudUsed.value).toBe(false)
  })

  it('removes browser listeners on unmount', async () => {
    setNavigatorOnline(true)
    vi.mocked(checkHeartbeatConnectivity).mockResolvedValue({ success: true })

    const { isOnline } = useNetworkStatus()
    await onMountedHandler?.()

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()

    setNavigatorOnline(false)
    globalThis.window.dispatchEvent(new globalThis.Event('offline'))
    expect(isOnline.value).toBe(true)
  })

  it('handles non-browser runtime without listener registration', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('navigator', undefined)
    vi.mocked(checkHeartbeatConnectivity).mockResolvedValue({ success: true })

    useNetworkStatus()

    expect(onMountedHandler).toBeDefined()
    await onMountedHandler?.()
    expect(checkHeartbeatConnectivity).not.toHaveBeenCalled()

    expect(onUnmountedHandler).toBeDefined()
    onUnmountedHandler?.()

    vi.unstubAllGlobals()
  })
})
