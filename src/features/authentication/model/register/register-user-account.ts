import { signUpWithMailAndPassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

/**
 * Executes the user registration use case.
 *
 * Triggers a monitoring event and delegates the actual sign-up process
 * to the Supabase API wrapper.
 *
 * @param email - User email address
 * @param password - User password
 * @returns A promise resolving to the registration result indicating success or failure.
 */
export function registerUserAccount(email: string, password: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
  return signUpWithMailAndPassword(email, password)
}
