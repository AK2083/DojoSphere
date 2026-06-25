import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring breadcrumb category for cloud status events. */
export const CATEGORY = 'cloudStatus'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for cloud status storage access. */
export const MONITORING_EVENTS = {
  STORAGE_READ: 'cloud.status.storage.read',
  STORAGE_WRITE: 'cloud.status.storage.write',
  TOGGLE_CHANGED: 'cloud.status.toggle.changed',
  CLOUD_CONFIRMED: 'cloud.status.confirmed'
} as const
