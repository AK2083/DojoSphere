import type { App } from 'vue'
import type { Router } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const electronInit = vi.fn()
const vueInit = vi.fn()
const browserTracingIntegration = vi.fn(() => ({ name: 'browserTracing' }))
const isPlaywrightBrowserOnly = vi.fn(() => false)

vi.mock('@sentry/electron/renderer', () => ({
  init: electronInit
}))

vi.mock('@sentry/vue', () => ({
  init: vueInit,
  browserTracingIntegration
}))

vi.mock('@shared/lib/electron/e2e-api', () => ({
  isPlaywrightBrowserOnly
}))

describe('initLoggingProvider', () => {
  const app = {} as App
  const router = {} as Router

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    isPlaywrightBrowserOnly.mockReturnValue(false)
    electronInit.mockReturnValue('electron-client')
    vueInit.mockReturnValue('vue-client')
  })

  it('uses electron and vue init in Electron mode', async () => {
    const { initLoggingProvider } = await import('./init-provider')

    const result = initLoggingProvider(app, router, 'https://example.com/1', 'development')

    expect(browserTracingIntegration).toHaveBeenCalledWith({ router })
    expect(electronInit).toHaveBeenCalledOnce()
    expect(electronInit.mock.calls[0]?.[0]).toMatchObject({
      tracesSampleRate: 0.01
    })

    const vueInitCallback = electronInit.mock.calls[0]?.[1] as (
      options: Record<string, unknown>
    ) => unknown
    vueInitCallback({ dsn: 'ignored' })

    expect(vueInit).toHaveBeenCalledWith({
      dsn: 'ignored',
      app
    })
    expect(result).toBe('electron-client')
  })

  it('falls back to vue init in Playwright browser-only mode', async () => {
    isPlaywrightBrowserOnly.mockReturnValue(true)

    const { initLoggingProvider } = await import('./init-provider')

    const result = initLoggingProvider(app, router, 'https://example.com/1', 'e2e')

    expect(electronInit).not.toHaveBeenCalled()
    expect(vueInit).toHaveBeenCalledWith({
      app,
      dsn: 'https://example.com/1',
      environment: 'e2e',
      integrations: [{ name: 'browserTracing' }],
      tracesSampleRate: 0.01
    })
    expect(result).toBe('vue-client')
  })
})
