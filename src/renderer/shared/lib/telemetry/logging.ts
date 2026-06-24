import { SpanStatusCode, trace } from '@opentelemetry/api'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

import { isActivityLoggingEnabled } from './activity-logging-scope'
import type { LogLevel } from './log-level'
import { shouldCaptureTelemetry } from './monitoring-guard'

const TRACER_NAME = 'dojosphere-renderer'
const MAX_BUFFERED_BREADCRUMBS = 30

type BufferedBreadcrumb = {
  name: string
  attributes: Record<string, string>
}

let userId: string | null = null
let breadcrumbBuffer: BufferedBreadcrumb[] = []

function getTracer() {
  return trace.getTracer(TRACER_NAME)
}

function isTelemetryActive(): boolean {
  return shouldCaptureTelemetry() && !isPlaywrightBrowserOnly()
}

function isBufferedLevel(level: LogLevel): boolean {
  return level === 'debug' || level === 'info'
}

function buildBreadcrumbAttributes(
  category: string,
  level: LogLevel,
  data?: object
): Record<string, string> {
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

  return eventAttributes
}

function bufferBreadcrumb(monitoringEvent: string, attributes: Record<string, string>) {
  breadcrumbBuffer.push({ name: monitoringEvent, attributes })

  if (breadcrumbBuffer.length > MAX_BUFFERED_BREADCRUMBS) {
    breadcrumbBuffer = breadcrumbBuffer.slice(-MAX_BUFFERED_BREADCRUMBS)
  }
}

function exportBreadcrumb(
  monitoringEvent: string,
  category: string,
  level: LogLevel,
  attributes: Record<string, string>
) {
  const activeSpan = trace.getActiveSpan()

  if (activeSpan) {
    activeSpan.addEvent(monitoringEvent, attributes)
    return
  }

  const span = getTracer().startSpan('breadcrumb', {
    attributes: { category, level }
  })
  span.addEvent(monitoringEvent, attributes)
  span.end()
}

function attachBufferedBreadcrumbs(span: ReturnType<ReturnType<typeof getTracer>['startSpan']>) {
  for (const breadcrumb of breadcrumbBuffer) {
    span.addEvent(breadcrumb.name, breadcrumb.attributes)
  }

  breadcrumbBuffer = []
}

/**
 * Sets the current user context for the logging provider.
 *
 * @param user User identifier attached to subsequent trace attributes.
 * @param user.id Stable user identifier (not PII beyond what the app already stores).
 */
export function setUserContext(user: { id: string }) {
  if (!isTelemetryActive() || !isActivityLoggingEnabled()) {
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

/**
 * Clears buffered breadcrumbs (for tests).
 */
export function resetBreadcrumbBuffer() {
  breadcrumbBuffer = []
}

function applyUserContext(attributes: Record<string, string>) {
  if (userId) {
    attributes['user.id'] = userId
  }
}

/**
 * Captures an exception and sends it to the local telemetry collector.
 * Buffered debug/info breadcrumbs are attached to the exception span.
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
  attachBufferedBreadcrumbs(span)
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  span.end()
}

/**
 * Adds a breadcrumb-style event for telemetry.
 *
 * Debug and info breadcrumbs are buffered locally and exported with the next
 * {@link captureException}. Warning and error breadcrumbs are exported immediately.
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

  if (!isActivityLoggingEnabled() && isBufferedLevel(level)) {
    return
  }

  const attributes = buildBreadcrumbAttributes(category, level, data)

  if (isBufferedLevel(level)) {
    bufferBreadcrumb(monitoringEvent, attributes)
    return
  }

  exportBreadcrumb(monitoringEvent, category, level, attributes)
}
