import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as Sentry from '@sentry/vue'

export default function initLoggingProvider(
  app: App,
  router: Router,
  dsn: string,
  environmentMode: string
) {
  return Sentry.init({
    app,
    dsn: dsn,
    integrations: [Sentry.browserTracingIntegration({ router })],
    tracesSampleRate: 0.01,
    environment: environmentMode
  })
}
