import { SpanStatusCode, trace } from '@opentelemetry/api'

import { uploadTracesOnError } from '@main/features/telemetry'

const TRACER_NAME = 'dojosphere-main'

function resolveErrorCode(error: Error): string | undefined {
  if ('code' in error && typeof error.code === 'string') {
    return error.code
  }

  return undefined
}

/**
 * Captures an exception as an OpenTelemetry span for local trace export.
 *
 * @param error Error to record on the span.
 * @param service Logical service or module name.
 * @param action Action that triggered the error.
 */
export function captureException(error: Error, service: string, action: string) {
  const attributes: Record<string, string> = {
    'service.name': service,
    action
  }
  const errorCode = resolveErrorCode(error)

  if (errorCode) {
    attributes['error.code'] = errorCode
  }

  const span = trace.getTracer(TRACER_NAME).startSpan('exception', { attributes })
  span.recordException(error)
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: errorCode ?? 'error'
  })
  span.end()

  void uploadTracesOnError()
}
