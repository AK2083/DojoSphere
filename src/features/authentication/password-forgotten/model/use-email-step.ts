import { ref } from 'vue'
import { signInWithOneTimePassword } from '@shared/auth'

/**
 * Composable for the email step of the password forgotten flow.
 * Manages the email input, loading state, error messages, and validation.
 *
 * @returns Refs and functions:
 * - `email` – the email input value
 * - `loading` – whether the submission is in progress
 * - `error` – any error message from the submission attempt
 * - `submit` – function to call to submit the email for OTP sign-in
 *
 * @example
 * const { email, loading, error, submit } = useEmailStep()
 */
export function useEmailStep() {
  const email = ref<string>('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function submit() {
    if (loading.value) return false
    if (!email.value.trim()) return false

    loading.value = true
    error.value = null

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
    loading,
    error,
    submit
  }
}
