import { ref } from 'vue'

import { signInWithOneTimePassword } from '../../api/sign-in-with-otp'
import { MONITORING_EVENTS, monitorWarning } from '../../monitoring/monitoring'

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
    if (loading.value || !email.value.trim()) {
      if (!email.value.trim()) {
        monitorWarning(MONITORING_EVENTS.EMAIL_STEP_VALIDATION_FAILED, {
          reason: 'missing_email'
        })
      }

      return false
    }

    loading.value = true
    clearError()

    try {
      const result = await signInWithOneTimePassword(email.value)

      if (!result.success) {
        monitorWarning(MONITORING_EVENTS.EMAIL_STEP_SIGN_IN_FAILED, {
          errorCode: result.error.code
        })

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
