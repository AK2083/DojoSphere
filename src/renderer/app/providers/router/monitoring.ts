import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring breadcrumb category for router events. */
export const CATEGORY = 'router'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for router navigation. */
export const MONITORING_EVENTS = {
  ROUTE_CHANGED: 'router.route.changed'
} as const
