import * as Sentry from '@sentry/electron/main'

/**
 * Initializes Sentry in the Electron main process with offline disk queue support.
 *
 * @param dsn - GlitchTip/Sentry DSN; when empty, monitoring is not started.
 * @param environment - Application environment label (e.g. `development`, `production`).
 */
export function initMonitoring(dsn: string, environment: string): void {
  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: 0.01,
    transportOptions: {
      maxAgeDays: 30,
      maxQueueSize: 30,
      flushAtStartup: true
    }
  })
}
