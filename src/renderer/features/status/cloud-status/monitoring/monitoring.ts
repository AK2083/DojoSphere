import { addBreadcrumb } from '@shared/lib'

/** Monitoring breadcrumb category for cloud status events. */
export const CATEGORY = 'cloudStatus'

/** Monitoring event identifiers for cloud status storage access. */
export const MONITORING_EVENTS = {
  STORAGE_READ: 'cloud.status.storage.read',
  STORAGE_WRITE: 'cloud.status.storage.write'
}

/**
 * Records cloud status breadcrumbs for monitoring.
 * @param event Monitoring event identifier.
 * @param data Optional event payload.
 */
export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, 'info', data)
}
