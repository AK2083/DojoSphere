import { resendSignUpConfirmationEmail } from '@shared/api'
import type { RegisterResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../../../password-forgotten/model/monitoring'

/**
 * Triggers resend of the sign-up confirmation mail and records monitoring data.
 *
 * @param {string} email - The email address to resend confirmation to.
 * @returns {Promise<RegisterResult>} Result of resend attempt.
 */
export function resendOtp(email: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.RESEND_OTP)
  return resendSignUpConfirmationEmail(email)
}
