import { ref } from 'vue'

import { signInWithOneTimePassword } from '../../api/sign-in-with-otp'
import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

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
    monitorInformation(MONITORING_EVENTS.EMAIL_STEP_EXECUTE_STARTED)

    if (loading.value) {
      monitorInformation(MONITORING_EVENTS.EMAIL_STEP_ALREADY_LOADING)
      return false
    }

    if (!email.value.trim()) {
      monitorInformation(MONITORING_EVENTS.EMAIL_STEP_VALIDATION_FAILED, {
        reason: 'missing_email'
      })

      return false
    }

    loading.value = true
    clearError()

    try {
      const result = await signInWithOneTimePassword(email.value)

      if (!result.success) {
        monitorInformation(MONITORING_EVENTS.EMAIL_STEP_SIGN_IN_FAILED, {
          errorCode: result.error.code
        })

        error.value = result.error.message
        return false
      }

      monitorInformation(MONITORING_EVENTS.EMAIL_STEP_SIGN_IN_SUCCEEDED)
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
