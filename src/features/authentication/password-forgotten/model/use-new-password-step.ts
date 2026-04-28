import { ref } from 'vue'
import { setNewPassword } from '@shared/auth'

/**
 * Hook for setting a new password during the password recovery process.
 * Manages the loading state, error messages, and validation status during the password reset process.
 *
 * @returns An object containing the password input, loading state, error message, validation status, and submit function.
 */
export function useNewPasswordStep() {
  const password = ref<string | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isValid = ref(false)

  async function submit() {
    loading.value = true
    error.value = null

    const response = await setNewPassword(password.value ?? '')

    loading.value = false

    if (!response.success) {
      error.value = response.error.code
      return false
    }

    error.value = null
    isValid.value = true
    return true
  }

  return {
    password,
    loading,
    error,
    isValid,
    submit
  }
}
