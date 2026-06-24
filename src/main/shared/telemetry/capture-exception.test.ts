import { beforeEach, describe, expect, it, vi } from 'vitest'

const exceptionSpan = {
  recordException: vi.fn(),
  setStatus: vi.fn(),
  end: vi.fn()
}

const startSpan = vi.fn(() => exceptionSpan)
const getTracer = vi.fn(() => ({ startSpan }))

vi.mock('@opentelemetry/api', () => ({
  SpanStatusCode: { ERROR: 2 },
  trace: {
    getTracer
  }
}))

vi.mock('@main/features/telemetry', () => ({
  uploadTracesOnError: vi.fn()
}))

describe('main captureException', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('records an exception span with service metadata', async () => {
    const { captureException } = await import('./capture-exception')
    const error = new Error('disk full')

    captureException(error, 'telemetry', 'persist')

    expect(getTracer).toHaveBeenCalledWith('dojosphere-main')
    expect(startSpan).toHaveBeenCalledWith('exception', {
      attributes: { 'service.name': 'telemetry', action: 'persist' }
    })
    expect(exceptionSpan.recordException).toHaveBeenCalledWith(error)
    expect(exceptionSpan.setStatus).toHaveBeenCalledWith({
      code: 2,
      message: 'error'
    })
    expect(exceptionSpan.end).toHaveBeenCalledOnce()
  })

  it('records error.code on AppError spans', async () => {
    const { captureException } = await import('./capture-exception')
    const error = Object.assign(new Error('hidden'), { code: 'shared.error.unknown' })

    captureException(error, 'telemetry', 'persist')

    expect(startSpan).toHaveBeenCalledWith('exception', {
      attributes: {
        'service.name': 'telemetry',
        action: 'persist',
        'error.code': 'shared.error.unknown'
      }
    })
    expect(exceptionSpan.setStatus).toHaveBeenCalledWith({
      code: 2,
      message: 'shared.error.unknown'
    })
  })
})
