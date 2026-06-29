let activityLoggingEnabled = true

/**
 * Enables or disables activity-oriented audit calls.
 *
 * Routes with `meta: { activityLogging: false }` set this to `false`.
 *
 * @param enabled - Whether audit IPC is allowed on the current route.
 */
export function setActivityLoggingEnabled(enabled: boolean) {
  activityLoggingEnabled = enabled
}

/**
 * Indicates whether the current route allows activity logging.
 *
 * @returns `true` unless the current route opted out via route meta.
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
