import { ref } from 'vue'
import { setNewPassword } from '@shared/auth'

/**
 * Hook for setting a new password during the password recovery process.
 * Manages the loading state, error messages, and validation status during the password reset process.
 *
 * @returns An object containing the password input, loading state, error message, validation status, and submit function.
 */
export function useNewPasswordStep() {
  const password = ref<string>('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isValid = ref(false)

  async function submit() {
    if (loading.value) return false

    loading.value = true
    error.value = null
    isValid.value = false

    try {
      const response = await setNewPassword(password.value ?? '')

      if (!response.success) {
        error.value = response.error.code
        return false
      }

      error.value = null
      isValid.value = true

      return true
    } finally {
      loading.value = false
    }
  }

  return {
    password,
    loading,
    error,
    isValid,
    submit
  }
}
