import { createMainMonitoring } from '@main/shared/logging'

/** Monitoring scope for user management in the main process. */
export const SCOPE = 'users'

export /**
 *
 */
const { logDebug, logInformation, logWarning, logError } = createMainMonitoring(SCOPE)

/** Monitoring event identifiers for user flows. */
export const MONITORING_EVENTS = {
  ENSURE_LOCAL_SESSION: 'users.ensure_local_session',
  ADD_USER_WITH_SESSION: 'users.add_user_with_session',
  UPDATE_DISPLAY_NAME: 'users.update_display_name',
  LIST_USERS: 'users.list_users'
} as const
