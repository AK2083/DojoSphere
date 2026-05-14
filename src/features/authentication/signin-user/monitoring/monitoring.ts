import { addBreadcrumb } from '@shared/lib'

/**
 * Monitoring category used for authentication-related events.
 *
 * This category groups all monitoring breadcrumbs that originate
 * from authentication flows (e.g. login, register).
 */
export const CATEGORY = 'authentication'

/**
 * Collection of monitoring event identifiers related to authentication.
 *
 * These constants are used when sending monitoring breadcrumbs to ensure
 * consistent event naming across the application.
 */
export const MONITORING_EVENTS = {
  LOGIN_EXECUTE_STARTED: 'auth.login.execute.started',
  LOGIN_ALREADY_LOADING: 'auth.login.already.loading',
  LOGIN_FAILED: 'auth.login.failed',
  LOGIN_SUCCEEDED: 'auth.login.succeeded',
  LOGIN_EXCEPTION: 'auth.login.exception',

  LOGIN_FORM_SUBMITTED: 'auth.login.form.submitted',
  LOGIN_FORM_ALREADY_LOADING: 'auth.login.form.already.loading',
  LOGIN_FORM_MISSING: 'auth.login.form.missing',
  LOGIN_FORM_INVALID: 'auth.login.form.invalid',
  LOGIN_FORM_EXECUTE_FAILED: 'auth.login.form.execute.failed',
  LOGIN_FORM_SUCCEEDED: 'auth.login.form.succeeded',
  LOGIN_FORM_NAVIGATION_STARTED: 'auth.login.form.navigation.started',
  PASSWORD_RESET_NAVIGATION_STARTED: 'auth.login.password-reset.navigation.started'
}

/**
 * Records an informational monitoring breadcrumb for authentication events.
 *
 * This function wraps {@link addBreadcrumb} and automatically assigns
 * the authentication monitoring category and the log level `info`.
 *
 * @param {string} event - The monitoring event identifier.
 * @param {object} [data] - Optional additional data associated with the event.
 */
export function monitorInformation(event: string, data?: object) {
  addBreadcrumb(event, CATEGORY, 'info', data)
}
