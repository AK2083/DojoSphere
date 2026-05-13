import { ref } from 'vue'

import { checkOneTimePasswordByRecovery } from '../../api/check-otp-by-recovery'
import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

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
    monitorInformation(MONITORING_EVENTS.OTP_EXECUTE_STARTED)

    if (loading.value) {
      monitorInformation(MONITORING_EVENTS.OTP_ALREADY_LOADING)
      return false
    }

    if (!email.value.trim() || !token.value.trim()) {
      monitorInformation(MONITORING_EVENTS.OTP_VALIDATION_FAILED, {
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
        monitorInformation(MONITORING_EVENTS.OTP_CHECK_FAILED, {
          errorCode: response.error.code
        })

        error.value = response.error.code
        return false
      }

      monitorInformation(MONITORING_EVENTS.OTP_CHECK_SUCCEEDED)
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
