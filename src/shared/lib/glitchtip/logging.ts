import * as Sentry from '@sentry/vue'

import type { LogLevel } from './log-level'

export function setUserContext(user: { id: string }) {
  Sentry.setUser(user)
}

export function clearUserContext() {
  Sentry.setUser(null)
}

export function captureException(error: Error, service: string, action: string) {
  Sentry.captureException(error, {
    tags: { service, action },
    extra: { message: error.message }
  })
}

export function addBreadcrumb(
  monitoringEvent: string,
  category: string,
  level: LogLevel,
  data?: object
) {
  Sentry.addBreadcrumb({
    category: category,
    message: monitoringEvent,
    level: level,
    data: data
  })
}
