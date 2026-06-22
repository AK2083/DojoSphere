import { beforeEach, describe, expect, it, vi } from 'vitest'

const initTelemetry = vi.fn(async () => undefined)
const shutdownTelemetry = vi.fn(async () => undefined)
const registerProcessErrorHandlers = vi.fn()
const appGetPath = vi.fn(() => '/tmp/dojosphere-user-data')
const onBeforeQuit = vi.fn()

vi.mock('@main/features/telemetry', () => ({
  initTelemetry,
  shutdownTelemetry
}))

vi.mock('@main/shared/telemetry', () => ({
  registerProcessErrorHandlers
}))

vi.mock('electron', () => ({
  app: {
    getPath: appGetPath,
    on: onBeforeQuit
  }
}))

describe('initTelemetryApp', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('starts telemetry with environment and userData path', async () => {
    const { initTelemetryApp } = await import('./init-telemetry')

    await initTelemetryApp('test')

    expect(appGetPath).toHaveBeenCalledWith('userData')
    expect(initTelemetry).toHaveBeenCalledWith({
      environment: 'test',
      userDataPath: '/tmp/dojosphere-user-data'
    })
    expect(registerProcessErrorHandlers).toHaveBeenCalledOnce()
    expect(onBeforeQuit).toHaveBeenCalledWith('before-quit', expect.any(Function))
  })

  it('shuts down telemetry when the app emits before-quit', async () => {
    const { initTelemetryApp } = await import('./init-telemetry')

    await initTelemetryApp('test')

    const beforeQuitHandler = onBeforeQuit.mock.calls[0]?.[1] as () => void
    beforeQuitHandler()

    expect(shutdownTelemetry).toHaveBeenCalledOnce()
  })

  it('registers the before-quit handler only once', async () => {
    const { initTelemetryApp } = await import('./init-telemetry')

    await initTelemetryApp('test')
    await initTelemetryApp('test')

    expect(onBeforeQuit).toHaveBeenCalledOnce()
  })
})
