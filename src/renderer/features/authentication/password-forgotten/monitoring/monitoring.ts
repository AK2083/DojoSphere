import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for password recovery flows. */
export const CATEGORY = 'authentication.passwordForgotten'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for password recovery flows. */
export const MONITORING_EVENTS = {
  EMAIL_STEP_SUBMITTED: 'auth.password-forgotten.email.step.submitted',
  EMAIL_STEP_FORM_MISSING: 'auth.password-forgotten.email.step.form.missing',
  EMAIL_STEP_FORM_INVALID: 'auth.password-forgotten.email.step.form.invalid',
  EMAIL_STEP_EXECUTE_FAILED: 'auth.password-forgotten.email.step.execute.failed',
  EMAIL_STEP_SUCCEEDED: 'auth.password-forgotten.email.step.succeeded',
  EMAIL_STEP_EXECUTE_STARTED: 'auth.password-forgotten.email.step.execute.started',
  EMAIL_STEP_ALREADY_LOADING: 'auth.password-forgotten.email.step.already.loading',
  EMAIL_STEP_VALIDATION_FAILED: 'auth.password-forgotten.email.step.validation.failed',
  EMAIL_STEP_SIGN_IN_FAILED: 'auth.password-forgotten.email.step.sign.in.failed',
  EMAIL_STEP_SIGN_IN_SUCCEEDED: 'auth.password-forgotten.email.step.sign.in.succeeded',
  NEW_PASSWORD_EXECUTE_STARTED: 'auth.password-forgotten.new-password.step.execute.started',
  NEW_PASSWORD_ALREADY_LOADING: 'auth.password-forgotten.new-password.step.already.loading',
  NEW_PASSWORD_VALIDATION_FAILED: 'auth.password-forgotten.new-password.step.validation.failed',
  NEW_PASSWORD_FAILED: 'auth.password-forgotten.new-password.step.failed',
  NEW_PASSWORD_SUCCEEDED: 'auth.password-forgotten.new-password.step.succeeded',
  NEW_PASSWORD_FORM_SUBMITTED: 'auth.password-forgotten.new-password.step.form.submitted',
  NEW_PASSWORD_FORM_MISSING: 'auth.password-forgotten.new-password.step.form.missing',
  NEW_PASSWORD_FORM_INVALID: 'auth.password-forgotten.new-password.step.form.invalid',
  NEW_PASSWORD_FORM_PASSWORDS_MISMATCH:
    'auth.password-forgotten.new-password.step.form.passwords.mismatch',
  NEW_PASSWORD_FORM_SUCCEEDED: 'auth.password-forgotten.new-password.step.form.succeeded',
  OTP_EXECUTE_STARTED: 'auth.password-forgotten.otp.step.execute.started',
  OTP_ALREADY_LOADING: 'auth.password-forgotten.otp.step.already.loading',
  OTP_VALIDATION_FAILED: 'auth.password-forgotten.otp.step.validation.failed',
  OTP_CHECK_FAILED: 'auth.password-forgotten.otp.step.check.failed',
  OTP_CHECK_SUCCEEDED: 'auth.password-forgotten.otp.step.check.succeeded',
  OTP_EXCEPTION: 'auth.password-forgotten.otp.step.exception',
  OTP_FORM_SUBMITTED: 'auth.password-forgotten.otp.step.form.submitted',
  OTP_FORM_INVALID: 'auth.password-forgotten.otp.step.form.invalid',
  OTP_FORM_EXECUTE_FAILED: 'auth.password-forgotten.otp.step.form.execute.failed',
  OTP_FORM_SUCCEEDED: 'auth.password-forgotten.otp.step.form.succeeded',
  RESEND_OTP: 'auth.password-forgotten.otp.resend'
} as const
