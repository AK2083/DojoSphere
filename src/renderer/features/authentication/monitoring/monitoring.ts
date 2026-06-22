import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for shared authentication flows. */
export const CATEGORY = 'authentication'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for shared authentication flows. */
export const MONITORING_EVENTS = {
  STORAGE_OTP_READ: 'auth.otp.storage.read',
  STORAGE_OTP_WRITE: 'auth.otp.storage.write',
  STORAGE_REGISTER_EMAIL_READ: 'auth.register.email.storage.read',
  STORAGE_REGISTER_EMAIL_WRITE: 'auth.register.email.storage.write',
  LOCAL_SESSION_BOOTSTRAP_STARTED: 'auth.local.session.bootstrap.started',
  LOCAL_SESSION_BOOTSTRAP_SKIPPED: 'auth.local.session.bootstrap.skipped',
  LOCAL_SESSION_BOOTSTRAP_NO_USERNAME: 'auth.local.session.bootstrap.no_username',
  LOCAL_SESSION_BOOTSTRAP_FAILED: 'auth.local.session.bootstrap.failed',
  LOCAL_SESSION_BOOTSTRAP_SUCCEEDED: 'auth.local.session.bootstrap.succeeded',
  AUTH_STATE_CHANGED: 'auth.state.changed'
} as const
