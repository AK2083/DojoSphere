import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for sign-in flows. */
export const CATEGORY = 'authentication'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for sign-in flows. */
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
} as const
