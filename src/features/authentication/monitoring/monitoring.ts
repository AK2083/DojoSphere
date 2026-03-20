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
  AUTH_REGISTER_SUBMITTED: 'auth.register.submitted',
  CHECK_OTP: 'auth.otp.verify',
  RESEND_OTP: 'auth.otp.resend',
  STORAGE_OTP_READ: 'auth.otp.storage.read',
  STORAGE_OTP_WRITE: 'auth.otp.storage.write'
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
