import { ref } from 'vue'
import type { AuthActionResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { checkOneTimePasswordByRecovery } from '../../service/otp-step/check-otp-by-recovery'

/**
 * Handles OTP verification request state for recovery flow.
 *
 * @returns State and handlers for verifying recovery OTP.
 */
export function useOtpStep() {
  const email = ref('')
  const token = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isValid = ref(false)

  function clearError() {
    error.value = null
  }

  async function execute() {
    if (loading.value) return false

    loading.value = true
    clearError()
    isValid.value = false

    try {
      const response = await checkOtp(email.value, token.value)

      if (!response.success) {
        error.value = response.error.code
        return false
      }

      isValid.value = true
      return true
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    token,
    error,
    loading,
    isValid,
    clearError,
    execute
  }
}

/**
 * Checks a one-time password (OTP) for password recovery.
 *
 * @param password - The new password that should be stored for the current user.
 * @param email - User email address associated with the recovery flow.
 * @param token - One-time password sent to the user.
 * @returns Result containing success state or mapped error details.
 */
export function checkOtp(email: string, token: string): Promise<AuthActionResult> {
  monitorInformation(MONITORING_EVENTS.CHECK_OTP_SUBMITTED)

  return checkOneTimePasswordByRecovery(email, token)
}
