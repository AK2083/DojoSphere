import { addBreadcrumb } from '@shared/lib'

export const CATEGORY = 'router'

/**
 * Collection of monitoring event identifiers related to router.
 *
 * These constants are used when sending monitoring breadcrumbs to ensure
 * consistent event naming across the application.
 */
export const MONITORING_EVENTS = {
  ROUTE_CHANGED: 'router.route.changed'
}

/**
 * Records an informational monitoring breadcrumb for router events.
 *
 * This function wraps {@link addBreadcrumb} and automatically assigns
 * the router monitoring category and the log level `info`.
 *
 * @param {string} event - The monitoring event identifier.
 * @param {object} [data] - Optional additional data associated with the event.
 */
export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, 'info', data)
}
