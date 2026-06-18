import type { App } from 'vue'
import type { Router } from 'vue-router'
import { init as electronInit } from '@sentry/electron/renderer'
import { browserTracingIntegration, init as vueInit } from '@sentry/vue'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

const TRACES_SAMPLE_RATE = 0.01

/**
 * Initializes the logging and monitoring provider (Sentry).
 *
 * In Electron, renderer events are routed through the main process via
 * `@sentry/electron`. In Playwright browser-only mode, falls back to `@sentry/vue`.
 *
 * @param app - The Vue application instance.
 * @param router - The Vue Router instance used for navigation tracing.
 * @param dsn - The Sentry DSN (used in Playwright fallback only; main process owns DSN in Electron).
 * @param environmentMode - The application environment (Playwright fallback only).
 * @returns The initialized Sentry client instance, or undefined when not initialized.
 */
export function initLoggingProvider(
  app: App,
  router: Router,
  dsn: string,
  environmentMode: string
) {
  if (isPlaywrightBrowserOnly()) {
    return vueInit({
      app,
      dsn,
      integrations: [browserTracingIntegration({ router })],
      tracesSampleRate: TRACES_SAMPLE_RATE,
      environment: environmentMode
    })
  }

  return electronInit(
    {
      integrations: [browserTracingIntegration({ router })],
      tracesSampleRate: TRACES_SAMPLE_RATE
    },
    (options) => vueInit({ ...options, app })
  )
}
