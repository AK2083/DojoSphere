import { ref } from 'vue'

import { setNewPassword } from '../../api/set-new-password'
import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'

/**
 * Handles new-password request state for recovery flow.
 *
 * @returns State and handlers for setting a new password.
 */
export function useNewPasswordStep() {
  const password = ref<string>('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isValid = ref(false)

  function clearError() {
    error.value = null
  }

  async function execute() {
    monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_EXECUTE_STARTED)

    if (loading.value) {
      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_ALREADY_LOADING)
      return false
    }

    if (!password.value.trim()) {
      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_VALIDATION_FAILED, {
        reason: 'missing_password'
      })

      return false
    }

    loading.value = true
    clearError()
    isValid.value = false

    try {
      const response = await setNewPassword(password.value)

      if (!response.success) {
        monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_FAILED, {
          errorCode: response.error.code
        })

        error.value = response.error.code
        return false
      }

      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_SUCCEEDED)
      isValid.value = true
      return true
    } finally {
      loading.value = false
    }
  }

  return {
    password,
    error,
    loading,
    isValid,
    clearError,
    execute
  }
}
