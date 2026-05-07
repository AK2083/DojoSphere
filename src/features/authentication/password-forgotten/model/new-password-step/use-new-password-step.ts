import { ref } from 'vue'

import { setNewPassword } from './set-new-password'

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
    if (loading.value) return false

    loading.value = true
    clearError()
    isValid.value = false

    try {
      const response = await setNewPassword(password.value ?? '')

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
    password,
    error,
    loading,
    isValid,
    clearError,
    execute
  }
}
