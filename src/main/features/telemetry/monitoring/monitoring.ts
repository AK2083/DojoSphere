import { createMainMonitoring } from '@main/shared/logging'

/** Monitoring scope for telemetry infrastructure in the main process. */
export const SCOPE = 'telemetry'

export /**
 *
 */
const { logDebug, logInformation, logWarning, logError } = createMainMonitoring(SCOPE)

/** Monitoring event identifiers for telemetry flows. */
export const MONITORING_EVENTS = {
  COLLECTOR_STARTED: 'telemetry.collector.started',
  COLLECTOR_TRACE_BATCH: 'telemetry.collector.trace_batch',
  COLLECTOR_PERSIST_FAILED: 'telemetry.collector.persist_failed',
  COLLECTOR_REQUEST_ERROR: 'telemetry.collector.request_error',
  NODE_TRACER_INITIALIZED: 'telemetry.node.initialized',
  TRACE_UPLOAD_FAILED: 'telemetry.trace_upload.failed'
} as const
