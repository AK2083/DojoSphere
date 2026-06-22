import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for sign-out flows. */
export const CATEGORY = 'authentication.signOut'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for sign-out flows. */
export const MONITORING_EVENTS = {
  SIGN_OUT_STARTED: 'auth.sign_out.started',
  SIGN_OUT_LOCAL_REVOKED: 'auth.sign_out.local.revoked',
  SIGN_OUT_CLOUD_SKIPPED: 'auth.sign_out.cloud.skipped',
  SIGN_OUT_FAILED: 'auth.sign_out.failed',
  SIGN_OUT_SUCCEEDED: 'auth.sign_out.succeeded'
} as const
