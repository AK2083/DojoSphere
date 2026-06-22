import { createLogger, type LogContext } from './logger'

/** Level-specific logging helpers for a main-process feature scope. */
export type MainMonitoringHelpers = {
  logDebug: (event: string, context?: LogContext) => void
  logInformation: (event: string, context?: LogContext) => void
  logWarning: (event: string, context?: LogContext) => void
  logError: (event: string, context?: LogContext) => void
}

/**
 * Creates main-process monitoring helpers for a feature scope.
 *
 * @param scope Logical scope name used in log output.
 * @returns Helpers for debug, info, warning, and error log lines.
 */
export function createMainMonitoring(scope: string): MainMonitoringHelpers {
  const logger = createLogger(scope)

  return {
    logDebug: (event, context) => logger.debug(event, context),
    logInformation: (event, context) => logger.info(event, context),
    logWarning: (event, context) => logger.warn(event, context),
    logError: (event, context) => logger.error(event, context)
  }
}
