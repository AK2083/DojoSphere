import { registerUser } from '@shared/api/supabase/user'
import type { RegisterResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

/**
 * Registers a new user account.
 *
 * Before sending the registration request, a monitoring event
 * (`AUTH_REGISTER_SUBMITTED`) is recorded. The actual registration
 * is then delegated to {@link registerUser}.
 *
 * @param {string} email - The email address used for the new account.
 * @param {string} password - The password for the new account.
 *
 * @returns {Promise<RegisterResult>} A promise resolving with the result of
 * the {@link registerUser} call.
 */
export async function register(email: string, password: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
  return await registerUser(email, password)
}
