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
  CHECK_OTP_VALIDATION_FAILED: 'auth.otp.verify.validation.failed',
  CHECK_OTP_REQUEST_STARTED: 'auth.otp.verify.request.started',
  CHECK_OTP_FAILED: 'auth.otp.verify.failed',
  CHECK_OTP_SUCCEEDED: 'auth.otp.verify.succeeded',
  CHECK_OTP_SUBMITTED: 'auth.otp.verify.submitted',
  STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',

  RESEND_OTP_SUBMITTED: 'auth.otp.resend.submitted',
  RESEND_OTP_VALIDATION_FAILED: 'auth.otp.resend.validation.failed',
  RESEND_OTP_REQUEST_STARTED: 'auth.otp.resend.request.started',
  RESEND_OTP_FAILED: 'auth.otp.resend.failed',
  RESEND_OTP_SUCCEEDED: 'auth.otp.resend.succeeded'
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
