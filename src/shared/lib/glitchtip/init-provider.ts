import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as Sentry from '@sentry/vue'

/**
 * Initializes the logging and monitoring provider (Sentry).
 *
 * This function configures Sentry for the Vue application, enabling
 * error tracking and performance tracing. It attaches the Vue app
 * instance and router to Sentry so that navigation events and errors
 * within the application can be monitored.
 *
 * @param {App} app - The Vue application instance.
 * @param {Router} router - The Vue Router instance used for navigation tracing.
 * @param {string} dsn - The Sentry Data Source Name used to connect the client to the Sentry project.
 * @param {string} environmentMode - The current application environment (e.g. `development`, `staging`, `production`).
 *
 * @returns {ReturnType<typeof Sentry.init>} The initialized Sentry client instance.
 */
export function initLoggingProvider(
  app: App,
  router: Router,
  dsn: string,
  environmentMode: string
): ReturnType<typeof Sentry.init> {
  return Sentry.init({
    app,
    dsn: dsn,
    integrations: [Sentry.browserTracingIntegration({ router })],
    tracesSampleRate: 0.01,
    environment: environmentMode
  })
}
