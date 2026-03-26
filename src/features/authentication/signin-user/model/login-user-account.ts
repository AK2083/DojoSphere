import { signInWithEmailPassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

/**
 * Executes the email/password sign-in use case.
 *
 * Records a monitoring breadcrumb and delegates authentication to the
 * Supabase API wrapper {@link signInWithEmailPassword}.
 *
 * @param email - User email address
 * @param password - User password
 * @returns A promise resolving to the sign-in result (success or mapped error).
 */
export function loginUserAccount(email: string, password: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_LOGIN_SUBMITTED)
  return signInWithEmailPassword(email, password)
}
