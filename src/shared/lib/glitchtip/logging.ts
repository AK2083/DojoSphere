import * as Sentry from '@sentry/vue'

import type { LogLevel } from './log-level'

/**
 * Sets the current user context for the logging provider.
 *
 * This allows errors and performance traces to be associated with
 * a specific user in the monitoring system.
 *
 * @param {{ id: string }} user - The user information to attach to the logging context.
 */
export function setUserContext(user: { id: string }) {
  Sentry.setUser(user)
}

/**
 * Clears the current user context from the logging provider.
 *
 * This should typically be called when a user logs out to prevent
 * subsequent events from being associated with the previous user.
 */
export function clearUserContext() {
  Sentry.setUser(null)
}

/**
 * Captures an exception and sends it to the logging provider.
 *
 * Additional metadata such as the service and action are attached
 * as tags to make it easier to filter and analyze errors.
 *
 * @param {Error} error - The error that should be reported.
 * @param {string} service - The logical service or module where the error occurred (e.g. `auth`, `browser`).
 * @param {string} action - The specific action that triggered the error (e.g. `signUp`, `getStorageItem`).
 */
export function captureException(error: Error, service: string, action: string) {
  Sentry.captureException(error, {
    tags: { service, action },
    extra: { message: error.message }
  })
}

/**
 * Adds a breadcrumb to the logging provider.
 *
 * Breadcrumbs are small log entries that help reconstruct the sequence
 * of events leading up to an error.
 *
 * @param {string} monitoringEvent - A descriptive event identifier.
 * @param {string} category - The category of the event (e.g. `auth`, `settings`, `browser`).
 * @param {LogLevel} level - The severity level of the breadcrumb.
 * @param {object} [data] - Optional structured data associated with the event.
 */
export function addBreadcrumb(
  monitoringEvent: string,
  category: string,
  level: LogLevel,
  data?: object
) {
  Sentry.addBreadcrumb({
    category: category,
    message: monitoringEvent,
    level: level,
    data: data
  })
}
