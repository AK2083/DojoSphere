import { beforeEach, describe, expect, it, vi } from 'vitest'

const register = vi.fn()
const shutdown = vi.fn(async () => undefined)

const NodeTracerProvider = vi.fn(function NodeTracerProvider(this: {
  register: typeof register
  shutdown: typeof shutdown
}) {
  this.register = register
  this.shutdown = shutdown
})

const BatchSpanProcessor = vi.fn()
const OTLPTraceExporter = vi.fn()

vi.mock('@opentelemetry/sdk-trace-node', () => ({
  NodeTracerProvider,
  BatchSpanProcessor
}))

vi.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter
}))

vi.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: (attributes: object) => attributes
}))

vi.mock('@opentelemetry/semantic-conventions', () => ({
  ATTR_SERVICE_NAME: 'service.name',
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME: 'deployment.environment.name'
}))

describe('node-telemetry', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('initializes the main-process tracer provider with OTLP export', async () => {
    const { initNodeTelemetry } = await import('./node-telemetry')

    const handle = initNodeTelemetry({
      environment: 'test',
      otlpEndpoint: 'http://127.0.0.1:4318'
    })

    expect(NodeTracerProvider).toHaveBeenCalledOnce()
    expect(OTLPTraceExporter).toHaveBeenCalledWith({
      url: 'http://127.0.0.1:4318/v1/traces',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(BatchSpanProcessor).toHaveBeenCalledOnce()
    expect(register).toHaveBeenCalledOnce()
    expect(handle.provider).toBeDefined()
  })

  it('shuts down the main-process tracer provider', async () => {
    const forceFlush = vi.fn(async () => undefined)
    NodeTracerProvider.mockImplementation(function NodeTracerProvider(this: {
      register: typeof register
      shutdown: typeof shutdown
      forceFlush: typeof forceFlush
    }) {
      this.register = register
      this.shutdown = shutdown
      this.forceFlush = forceFlush
    })

    const { initNodeTelemetry, shutdownNodeTelemetry } = await import('./node-telemetry')

    const handle = initNodeTelemetry({
      environment: 'test',
      otlpEndpoint: 'http://127.0.0.1:4318'
    })

    await handle.forceFlush()

    expect(forceFlush).toHaveBeenCalledOnce()
    await shutdownNodeTelemetry(handle)

    expect(shutdown).toHaveBeenCalledOnce()
  })
})
