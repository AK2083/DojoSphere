import { createMainMonitoring } from '@main/shared/logging'

/** Monitoring scope for database health checks in the main process. */
export const SCOPE = 'health'

export /**
 *
 */
const { logDebug, logInformation, logWarning, logError } = createMainMonitoring(SCOPE)

/** Monitoring event identifiers for health flows. */
export const MONITORING_EVENTS = {
  DB_HEALTHCHECK: 'health.db.healthcheck'
} as const
