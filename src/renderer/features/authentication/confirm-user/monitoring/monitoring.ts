import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for email confirmation flows. */
export const CATEGORY = 'authentication.confirmUser'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for email confirmation flows. */
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
} as const
