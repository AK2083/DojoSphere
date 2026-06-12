import type * as Sentry from '@sentry/browser'

/**
 * Represents the log severity level used by the logging provider.
 *
 * This type is based on Sentry's {@link Sentry.SeverityLevel} and defines
 * the allowed log levels for captured events and breadcrumbs.
 *
 * Examples include `fatal`, `error`, `warning`, `info`, `debug`, and `log`.
 */
export type LogLevel = Readonly<Sentry.SeverityLevel>
