import { createMonitoringHelpers } from '@shared/lib/telemetry/monitoring-helpers'

/** Monitoring category for settings changes. */
export const CATEGORY = 'settings'

export /**
 *
 */
const { monitorDebug, monitorInformation, monitorWarning, monitorError } =
  createMonitoringHelpers(CATEGORY)

/** Monitoring event identifiers for settings flows. */
export const MONITORING_EVENTS = {
  LANGUAGE_CHANGED: 'settings.language.changed',
  THEME_CHANGED: 'settings.theme.changed',
  USERNAME_SESSION_ENSURE_STARTED: 'settings.username.session.ensure.started',
  USERNAME_SESSION_ENSURE_SKIPPED: 'settings.username.session.ensure.skipped',
  USERNAME_SESSION_ENSURE_FAILED: 'settings.username.session.ensure.failed',
  USERNAME_SESSION_ENSURE_SUCCEEDED: 'settings.username.session.ensure.succeeded',
  CLOUD_CHANGED: 'settings.cloud.changed',
  TELEMETRY_AUTO_UPLOAD_CHANGED: 'settings.telemetry.autoUpload.changed'
} as const
