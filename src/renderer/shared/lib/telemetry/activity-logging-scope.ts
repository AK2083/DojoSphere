let activityLoggingEnabled = true

/**
 * Enables or disables activity-oriented telemetry and audit calls.
 *
 * Audience routes set this to `false` so browsing is not tracked.
 *
 * @param enabled - Whether info/debug breadcrumbs, user context, and audit IPC are allowed.
 */
export function setActivityLoggingEnabled(enabled: boolean) {
  activityLoggingEnabled = enabled
}

/**
 * Indicates whether the current route allows activity logging.
 *
 * @returns `true` on authenticated director/scorekeeper paths; `false` on audience routes.
 */
export function isActivityLoggingEnabled(): boolean {
  return activityLoggingEnabled
}

/**
 * Resets activity logging to the default enabled state (for tests).
 */
export function resetActivityLoggingScope() {
  activityLoggingEnabled = true
}
