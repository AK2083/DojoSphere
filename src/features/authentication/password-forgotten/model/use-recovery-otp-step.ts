import { ref } from 'vue'
import { checkOneTimePasswordByRecovery } from '@shared/auth'

/**
 * Hook for verifying a recovery OTP.
 * Manages the loading state, error messages, and verification status during the OTP verification process.
 *
 * @param email The email address associated with the OTP to verify.
 * @param token The one-time password token to verify.
 * @returns An object containing the loading state, error, and verification status.
 */
export function useVerifyOtpByRecovery() {
  const email = ref<string>('')
  const token = ref<string>('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const isValid = ref(false)

  async function submit() {
    if (loading.value) return false

    loading.value = true
    error.value = null
    isValid.value = false

    try {
      const response = await checkOneTimePasswordByRecovery(email.value, token.value)

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
    email,
    token,
    loading,
    error,
    isValid,
    submit
  }
}
