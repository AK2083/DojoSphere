import { beforeEach, describe, expect, it, vi } from 'vitest'

const sentryInit = vi.fn()

vi.mock('@sentry/electron/main', () => ({
  init: sentryInit
}))

describe('initMonitoring', () => {
  beforeEach(() => {
    vi.resetModules()
    sentryInit.mockClear()
  })

  it('initializes Sentry with DSN, environment, and offline transport options', async () => {
    const { initMonitoring } = await import('./init-monitoring')

    initMonitoring('https://example.com/1', 'test')

    expect(sentryInit).toHaveBeenCalledOnce()
    expect(sentryInit).toHaveBeenCalledWith({
      dsn: 'https://example.com/1',
      environment: 'test',
      tracesSampleRate: 0.01,
      transportOptions: {
        maxAgeDays: 30,
        maxQueueSize: 30,
        flushAtStartup: true
      }
    })
  })

  it('skips initialization when DSN is empty', async () => {
    const { initMonitoring } = await import('./init-monitoring')

    initMonitoring('', 'test')

    expect(sentryInit).not.toHaveBeenCalled()
  })
})
