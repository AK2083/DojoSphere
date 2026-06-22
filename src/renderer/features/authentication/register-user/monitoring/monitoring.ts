import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for registration flows. */
export const CATEGORY = 'authentication'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for registration flows. */
export const MONITORING_EVENTS = {
  REGISTER_EXECUTE_STARTED: 'auth.register.execute.started',
  REGISTER_ALREADY_LOADING: 'auth.register.already.loading',
  REGISTER_SIGN_UP_FAILED: 'auth.register.sign_up.failed',
  REGISTER_SIGN_UP_SUCCEEDED: 'auth.register.sign_up.succeeded',
  REGISTER_STORAGE_UPDATED: 'auth.register.storage.updated',
  REGISTER_FORM_SUBMITTED: 'auth.register.form.submitted',
  REGISTER_FORM_ALREADY_LOADING: 'auth.register.form.already.loading',
  REGISTER_FORM_MISSING: 'auth.register.form.missing',
  REGISTER_FORM_INVALID: 'auth.register.form.invalid',
  REGISTER_FORM_EXECUTE_FAILED: 'auth.register.form.execute.failed',
  REGISTER_FORM_SUCCEEDED: 'auth.register.form.succeeded',
  REGISTER_FORM_NAVIGATION_STARTED: 'auth.register.form.navigation.started',
  STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',
  STORAGE_OTP_READ: 'auth.register.otp.storage.read'
} as const
