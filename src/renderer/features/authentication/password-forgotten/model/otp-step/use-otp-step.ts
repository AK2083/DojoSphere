import { ref } from 'vue'

import { checkOneTimePasswordByRecovery } from '../../api/check-otp-by-recovery'
import { MONITORING_EVENTS, monitorWarning } from '../../monitoring/monitoring'

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
    if (loading.value) {
      return false
    }

    if (!email.value.trim() || !token.value.trim()) {
      monitorWarning(MONITORING_EVENTS.OTP_VALIDATION_FAILED, {
        hasEmail: !!email.value.trim(),
        hasToken: !!token.value.trim()
      })

      return false
    }

    loading.value = true
    clearError()
    isValid.value = false

    try {
      const response = await checkOneTimePasswordByRecovery(email.value, token.value)

      if (!response.success) {
        monitorWarning(MONITORING_EVENTS.OTP_CHECK_FAILED, {
          errorCode: response.error.code
        })

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
