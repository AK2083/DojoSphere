import type { App } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const captureException = vi.fn()
const isPlaywrightBrowserOnly = vi.fn(() => false)

vi.mock('./logging', () => ({
  captureException
}))

vi.mock('@shared/lib/electron/e2e-api', () => ({
  isPlaywrightBrowserOnly
}))

describe('registerGlobalErrorHandlers', () => {
  const windowListeners = new Map<string, (event: unknown) => void>()

  beforeEach(() => {
    vi.clearAllMocks()
    windowListeners.clear()
    isPlaywrightBrowserOnly.mockReturnValue(false)

    vi.spyOn(globalThis, 'addEventListener').mockImplementation((type, listener) => {
      windowListeners.set(type, listener as (event: unknown) => void)
    })
  })

  it('skips registration in Playwright browser-only mode', async () => {
    isPlaywrightBrowserOnly.mockReturnValue(true)

    const { registerGlobalErrorHandlers } = await import('./register-global-error-handlers')
    const app = { config: {} } as App

    registerGlobalErrorHandlers(app)

    expect(app.config.errorHandler).toBeUndefined()
    expect(globalThis.addEventListener).not.toHaveBeenCalled()
  })

  it('captures Vue, window, and unhandled rejection errors', async () => {
    const { registerGlobalErrorHandlers } = await import('./register-global-error-handlers')
    const app = { config: {} } as App

    registerGlobalErrorHandlers(app)

    const vueError = new Error('render failed')
    app.config.errorHandler?.(vueError, null, 'render function')

    expect(captureException).toHaveBeenCalledWith(vueError, 'vue', 'render function')

    windowListeners.get('error')?.({
      error: undefined,
      message: 'script failed'
    })

    expect(captureException).toHaveBeenCalledWith(expect.any(Error), 'renderer', 'window.error')

    windowListeners.get('unhandledrejection')?.({
      reason: new Error('async failed')
    })

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'async failed' }),
      'renderer',
      'unhandledrejection'
    )
  })

  it('falls back to the default Vue info label when info is missing', async () => {
    const { registerGlobalErrorHandlers } = await import('./register-global-error-handlers')
    const app = { config: {} } as App

    registerGlobalErrorHandlers(app)

    app.config.errorHandler?.(new Error('boom'), null, '')

    expect(captureException).toHaveBeenCalledWith(expect.any(Error), 'vue', 'errorHandler')
  })
})
