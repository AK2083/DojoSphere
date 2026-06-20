import { SpanStatusCode, trace } from '@opentelemetry/api'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

import type { LogLevel } from './log-level'
import { shouldCaptureTelemetry } from './monitoring-guard'

const TRACER_NAME = 'dojosphere-renderer'

let userId: string | null = null

function getTracer() {
  return trace.getTracer(TRACER_NAME)
}

function isTelemetryActive(): boolean {
  return shouldCaptureTelemetry() && !isPlaywrightBrowserOnly()
}

/**
 * Sets the current user context for the logging provider.
 *
 * @param user User identifier attached to subsequent trace attributes.
 * @param user.id Stable user identifier (not PII beyond what the app already stores).
 */
export function setUserContext(user: { id: string }) {
  if (!isTelemetryActive()) {
    return
  }

  userId = user.id
}

/**
 * Clears the current user context from the logging provider.
 */
export function clearUserContext() {
  if (!isTelemetryActive()) {
    return
  }

  userId = null
}

function applyUserContext(attributes: Record<string, string>) {
  if (userId) {
    attributes['user.id'] = userId
  }
}

/**
 * Captures an exception and sends it to the local telemetry collector.
 *
 * @param error - The error that should be reported.
 * @param service - The logical service or module where the error occurred.
 * @param action - The specific action that triggered the error.
 */
export function captureException(error: Error, service: string, action: string) {
  if (!isTelemetryActive()) {
    return
  }

  const attributes: Record<string, string> = {
    'service.name': service,
    action
  }
  applyUserContext(attributes)

  const span = getTracer().startSpan('exception', { attributes })
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  span.end()
}

/**
 * Adds a breadcrumb-style event to the active trace or a short-lived span.
 *
 * @param monitoringEvent - A descriptive event identifier.
 * @param category - The category of the event.
 * @param level - The severity level of the breadcrumb.
 * @param data - Optional structured data associated with the event.
 */
export function addBreadcrumb(
  monitoringEvent: string,
  category: string,
  level: LogLevel,
  data?: object
) {
  if (!isTelemetryActive()) {
    return
  }

  const eventAttributes: Record<string, string> = {
    category,
    level
  }
  applyUserContext(eventAttributes)

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      eventAttributes[key] = String(value)
    }
  }

  const activeSpan = trace.getActiveSpan()

  if (activeSpan) {
    activeSpan.addEvent(monitoringEvent, eventAttributes)
    return
  }

  const span = getTracer().startSpan('breadcrumb', {
    attributes: { category, level }
  })
  span.addEvent(monitoringEvent, eventAttributes)
  span.end()
}
