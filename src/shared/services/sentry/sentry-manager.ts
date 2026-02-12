import * as Sentry from "@sentry/browser";

import type { LogLevel } from "@shared/types/log-level";

export function setUserContext(user: { id: string } | null) {
  Sentry.setUser({ id: user?.id });
}

export function setContext(todos: any[], activeFilter: string) {
  Sentry.setContext("TodoState", {
    count: todos.length,
    filter: activeFilter,
  });
}

export function captureException(err: Error, service: string, action: string) {
  Sentry.captureException(err, {
    tags: { service: service, action: action },
    extra: { status: err.message },
  });
}

export function addBreadcrumb(
  monitoringEvent: string,
  category: string,
  level: LogLevel,
  data?: object,
) {
  Sentry.addBreadcrumb({
    category: category,
    message: monitoringEvent,
    level: level,
    data: data,
  });
}
