import type { Router } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const register = vi.fn()
const WebTracerProvider = vi.fn(function WebTracerProvider(this: { register: typeof register }) {
  this.register = register
})
const BatchSpanProcessor = vi.fn()
const OTLPTraceExporter = vi.fn()
const isPlaywrightBrowserOnly = vi.fn(() => false)

vi.mock('@opentelemetry/sdk-trace-web', () => ({
  WebTracerProvider,
  BatchSpanProcessor
}))

vi.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter
}))

vi.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: (attributes: object) => attributes
}))

vi.mock('@opentelemetry/context-zone', () => ({
  ZoneContextManager: vi.fn()
}))

vi.mock('@shared/lib/electron/e2e-api', () => ({
  isPlaywrightBrowserOnly
}))

describe('initLoggingProvider', () => {
  const router = {} as Router

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    isPlaywrightBrowserOnly.mockReturnValue(false)
  })

  it('registers a web tracer provider in Electron mode', async () => {
    const { initLoggingProvider } = await import('./init-provider')

    initLoggingProvider(router, 'development')

    expect(WebTracerProvider).toHaveBeenCalledOnce()
    expect(OTLPTraceExporter).toHaveBeenCalledWith({
      url: 'http://127.0.0.1:4318/v1/traces'
    })
    expect(register).toHaveBeenCalledOnce()
  })

  it('skips initialization in Playwright browser-only mode', async () => {
    isPlaywrightBrowserOnly.mockReturnValue(true)

    const { initLoggingProvider } = await import('./init-provider')

    initLoggingProvider(router, 'e2e')

    expect(WebTracerProvider).not.toHaveBeenCalled()
  })
})
