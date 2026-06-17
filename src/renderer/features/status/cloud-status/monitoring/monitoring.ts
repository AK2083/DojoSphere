import { addBreadcrumb } from '@shared/lib'

export const CATEGORY = 'cloudStatus'

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
