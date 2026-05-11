import { ref } from 'vue'

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
      const result = await signInWithOneTimePassword(email.value)

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
