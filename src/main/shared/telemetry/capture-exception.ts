import { SpanStatusCode, trace } from '@opentelemetry/api'

const TRACER_NAME = 'dojosphere-main'

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

  const span = trace.getTracer(TRACER_NAME).startSpan('exception', { attributes })
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  span.end()
}
