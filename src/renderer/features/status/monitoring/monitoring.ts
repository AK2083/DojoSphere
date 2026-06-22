import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for network status bootstrap. */
export const CATEGORY = 'networkStatus'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for network status flows. */
export const MONITORING_EVENTS = {
  BOOTSTRAP_STARTED: 'network.status.bootstrap.started',
  BOOTSTRAP_SKIPPED: 'network.status.bootstrap.skipped',
  BOOTSTRAP_COMPLETED: 'network.status.bootstrap.completed',
  CONNECTIVITY_OFFLINE: 'network.status.connectivity.offline',
  CONNECTIVITY_ONLINE: 'network.status.connectivity.online',
  HEARTBEAT_CHECK_STARTED: 'network.status.heartbeat.started',
  HEARTBEAT_CHECK_FAILED: 'network.status.heartbeat.failed',
  HEARTBEAT_CHECK_SUCCEEDED: 'network.status.heartbeat.succeeded',
  RECHECK_AFTER_FAILED_ACTION: 'network.status.recheck.after_failed_action'
} as const
