import { ref } from 'vue'
import type { AuthActionResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { signInWithOneTimePassword } from '../../service/sign-in-with-otp'

/**
 * Handles OTP mail request for the email step.
 *
 * @returns State and handlers for executing the email step request.
 */
export function useEmailStep() {
  const email = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  function clearError() {
    error.value = null
  }

  async function execute() {
    if (loading.value) return false
    if (!email.value.trim()) return false

    loading.value = true
    clearError()

    try {
      const result = await signInByEmail(email.value)

      if (!result.success) {
        error.value = result.error.message
        return false
      }

      return true
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    error,
    loading,
    clearError,
    execute
  }
}

/**
 * Registers a user account by validating a one-time password (OTP).
 *
 * This function triggers a monitoring event for a verification attempt
 * and then verifies the provided token against the given email.
 *
 * @param email - The user's email address used for registration.
 * @param token - The one-time password (OTP) or verification token.
 * @returns A promise that resolves with the result of the registration process.
 */
export function signInByEmail(email: string): Promise<AuthActionResult> {
  monitorInformation(MONITORING_EVENTS.SIGN_IN_BY_EMAIL_SUBMITTED)

  return signInWithOneTimePassword(email)
}
