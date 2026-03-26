import { checkOneTimePassword } from '@shared/api'
import type { RegisterResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../../../password-forgotten/model/monitoring'

/**
 * Registers a user account by validating a one-time password (OTP).
 *
 * This function triggers a monitoring event for a verification attempt
 * and then verifies the provided token against the given email.
 *
 * @param {string} email - The user's email address used for registration.
 * @param {string} token - The one-time password (OTP) or verification token.
 * @returns {Promise<RegisterResult>} A promise that resolves with the result of the registration process.
 *
 * @throws Will propagate any errors thrown during OTP verification.
 */
export function verifyOtp(email: string, token: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.CHECK_OTP)
  return checkOneTimePassword(email, token)
}
