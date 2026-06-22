import { createMainMonitoring } from '@main/shared/logging'

/** Monitoring scope for session management in the main process. */
export const SCOPE = 'sessions'

export /**
 *
 */
const { logDebug, logInformation, logWarning, logError } = createMainMonitoring(SCOPE)

/** Monitoring event identifiers for session flows. */
export const MONITORING_EVENTS = {
  CREATE_SESSION: 'sessions.create',
  GET_ACTIVE_SESSION: 'sessions.get_active',
  GET_ACTIVE_SESSION_MISS: 'sessions.get_active.miss',
  REVOKE_SESSION: 'sessions.revoke'
} as const
