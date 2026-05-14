import { addBreadcrumb } from '@shared/lib'

/**
 * Monitoring category used for authentication-related events.
 *
 * This category groups all monitoring breadcrumbs that originate
 * from authentication flows (e.g. login, register).
 */
export const CATEGORY = 'authentication.registerUser'

/**
 * Collection of monitoring event identifiers related to authentication.
 *
 * These constants are used when sending monitoring breadcrumbs to ensure
 * consistent event naming across the application.
 */
export const MONITORING_EVENTS = {
  STORAGE_OTP_READ: 'auth.register.otp.storage.read',
  STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',

  REGISTER_FORM_SUBMITTED: 'auth.register.form.submitted',
  REGISTER_FORM_ALREADY_LOADING: 'auth.register.form.already.loading',
  REGISTER_FORM_MISSING: 'auth.register.form.missing',
  REGISTER_FORM_INVALID: 'auth.register.form.invalid',
  REGISTER_FORM_EXECUTE_FAILED: 'auth.register.form.execute.failed',
  REGISTER_FORM_SUCCEEDED: 'auth.register.form.succeeded',
  REGISTER_FORM_NAVIGATION_STARTED: 'auth.register.form.navigation.started',

  REGISTER_EXECUTE_STARTED: 'auth.register.execute.started',
  REGISTER_ALREADY_LOADING: 'auth.register.already.loading',
  REGISTER_SIGN_UP_FAILED: 'auth.register.sign.up.failed',
  REGISTER_SIGN_UP_SUCCEEDED: 'auth.register.sign.up.succeeded',
  REGISTER_STORAGE_UPDATED: 'auth.register.storage.updated',
  REGISTER_EXCEPTION: 'auth.register.exception'
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
