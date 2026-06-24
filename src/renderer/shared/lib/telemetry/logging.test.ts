import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  breadcrumbSpan,
  exceptionSpan,
  startSpan,
  getTracer,
  getActiveSpan,
  shouldCaptureTelemetry,
  isPlaywrightBrowserOnly,
  isActivityLoggingEnabled,
  SpanStatusCode
} = vi.hoisted(() => {
  const breadcrumbSpan = {
    addEvent: vi.fn(),
    end: vi.fn()
  }

  const exceptionSpan = {
    addEvent: vi.fn(),
    recordException: vi.fn(),
    setStatus: vi.fn(),
    end: vi.fn()
  }

  const startSpan = vi.fn((name: string) => (name === 'exception' ? exceptionSpan : breadcrumbSpan))
  const getTracer = vi.fn(() => ({ startSpan }))
  const getActiveSpan = vi.fn()
  const shouldCaptureTelemetry = vi.fn(() => true)
  const isPlaywrightBrowserOnly = vi.fn(() => false)
  const isActivityLoggingEnabled = vi.fn(() => true)

  return {
    breadcrumbSpan,
    exceptionSpan,
    startSpan,
    getTracer,
    getActiveSpan,
    shouldCaptureTelemetry,
    isPlaywrightBrowserOnly,
    isActivityLoggingEnabled,
    SpanStatusCode: { ERROR: 2 }
  }
})

vi.mock('@opentelemetry/api', () => ({
  SpanStatusCode,
  trace: {
    getTracer,
    getActiveSpan
  }
}))

vi.mock('./monitoring-guard', () => ({
  shouldCaptureTelemetry,
  shouldUploadTelemetry: vi.fn(() => false)
}))

vi.mock('./init-provider', () => ({
  forceFlushRendererTelemetry: vi.fn(async () => {})
}))

vi.mock('./activity-logging-scope', () => ({
  isActivityLoggingEnabled
}))

vi.mock('@shared/lib/electron/e2e-api', () => ({
  isPlaywrightBrowserOnly
}))

describe('logging breadcrumbs', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    shouldCaptureTelemetry.mockReturnValue(true)
    isPlaywrightBrowserOnly.mockReturnValue(false)
    isActivityLoggingEnabled.mockReturnValue(true)
    getActiveSpan.mockReturnValue(undefined)

    const { resetBreadcrumbBuffer } = await import('./logging')
    resetBreadcrumbBuffer()
  })

  it('buffers debug and info breadcrumbs without exporting them immediately', async () => {
    const { addBreadcrumb } = await import('./logging')

    addBreadcrumb('auth.debug', 'authentication', 'debug', { step: 'read' })
    addBreadcrumb('auth.info', 'authentication', 'info')

    expect(startSpan).not.toHaveBeenCalled()
    expect(breadcrumbSpan.addEvent).not.toHaveBeenCalled()
  })

  it('exports warning breadcrumbs immediately', async () => {
    const { addBreadcrumb } = await import('./logging')

    addBreadcrumb('auth.warning', 'authentication', 'warning', { code: 'retry' })

    expect(startSpan).toHaveBeenCalledWith('breadcrumb', {
      attributes: { category: 'authentication', level: 'warning' }
    })
    expect(breadcrumbSpan.addEvent).toHaveBeenCalledWith('auth.warning', {
      category: 'authentication',
      level: 'warning',
      code: 'retry'
    })
    expect(breadcrumbSpan.end).toHaveBeenCalledOnce()
  })

  it('adds warning breadcrumbs to the active span when one exists', async () => {
    const activeSpan = { addEvent: vi.fn() }
    getActiveSpan.mockReturnValue(activeSpan)

    const { addBreadcrumb } = await import('./logging')

    addBreadcrumb('auth.warning', 'authentication', 'warning', { code: 'retry' })

    expect(activeSpan.addEvent).toHaveBeenCalledWith('auth.warning', {
      category: 'authentication',
      level: 'warning',
      code: 'retry'
    })
    expect(startSpan).not.toHaveBeenCalled()
  })

  it('stores and clears user context on exception spans', async () => {
    const { setUserContext, clearUserContext, captureException } = await import('./logging')

    setUserContext({ id: 'user-1' })
    captureException(new Error('with user'), 'auth', 'login')

    expect(exceptionSpan.addEvent).not.toHaveBeenCalled()
    expect(startSpan).toHaveBeenCalledWith('exception', {
      attributes: { 'service.name': 'auth', action: 'login', 'user.id': 'user-1' }
    })

    clearUserContext()
    captureException(new Error('without user'), 'auth', 'logout')

    expect(startSpan).toHaveBeenLastCalledWith('exception', {
      attributes: { 'service.name': 'auth', action: 'logout' }
    })
  })

  it('skips telemetry in Playwright browser-only mode', async () => {
    isPlaywrightBrowserOnly.mockReturnValue(true)

    const { addBreadcrumb, captureException } = await import('./logging')

    addBreadcrumb('auth.debug', 'authentication', 'debug')
    captureException(new Error('ignored'), 'auth', 'login')

    expect(startSpan).not.toHaveBeenCalled()
  })

  it('attaches buffered breadcrumbs to the next exception span and clears the buffer', async () => {
    const { addBreadcrumb, captureException, resetBreadcrumbBuffer } = await import('./logging')

    addBreadcrumb('auth.debug', 'authentication', 'debug', { step: 'read' })
    addBreadcrumb('auth.info', 'authentication', 'info')

    const error = new Error('boom')
    captureException(error, 'auth', 'login')

    expect(startSpan).toHaveBeenCalledWith('exception', {
      attributes: { 'service.name': 'auth', action: 'login' }
    })
    expect(exceptionSpan.addEvent).toHaveBeenCalledWith('auth.debug', {
      category: 'authentication',
      level: 'debug',
      step: 'read'
    })
    expect(exceptionSpan.addEvent).toHaveBeenCalledWith('auth.info', {
      category: 'authentication',
      level: 'info'
    })
    expect(exceptionSpan.recordException).toHaveBeenCalledWith(error)
    expect(exceptionSpan.setStatus).toHaveBeenCalledWith({
      code: SpanStatusCode.ERROR,
      message: 'error'
    })
    expect(exceptionSpan.end).toHaveBeenCalledOnce()

    resetBreadcrumbBuffer()
    vi.clearAllMocks()

    captureException(new Error('second'), 'auth', 'retry')

    expect(exceptionSpan.addEvent).not.toHaveBeenCalled()
  })

  it('skips telemetry when capture is disabled', async () => {
    shouldCaptureTelemetry.mockReturnValue(false)

    const { addBreadcrumb, captureException } = await import('./logging')

    addBreadcrumb('auth.debug', 'authentication', 'debug')
    captureException(new Error('ignored'), 'auth', 'login')

    expect(startSpan).not.toHaveBeenCalled()
  })

  it('skips info and debug breadcrumbs when activity logging is disabled', async () => {
    isActivityLoggingEnabled.mockReturnValue(false)

    const { addBreadcrumb } = await import('./logging')

    addBreadcrumb('audience.info', 'audience', 'info')
    addBreadcrumb('audience.debug', 'audience', 'debug')

    expect(startSpan).not.toHaveBeenCalled()
    expect(breadcrumbSpan.addEvent).not.toHaveBeenCalled()
  })

  it('still exports warning breadcrumbs when activity logging is disabled', async () => {
    isActivityLoggingEnabled.mockReturnValue(false)

    const { addBreadcrumb } = await import('./logging')

    addBreadcrumb('audience.warning', 'audience', 'warning', { code: 'retry' })

    expect(startSpan).toHaveBeenCalledWith('breadcrumb', {
      attributes: { category: 'audience', level: 'warning' }
    })
  })

  it('skips setUserContext when activity logging is disabled', async () => {
    isActivityLoggingEnabled.mockReturnValue(false)

    const { setUserContext, captureException } = await import('./logging')

    setUserContext({ id: 'user-1' })
    captureException(new Error('anonymous path'), 'audience', 'view')

    expect(startSpan).toHaveBeenCalledWith('exception', {
      attributes: { 'service.name': 'audience', action: 'view' }
    })
  })
})
