import { ref } from 'vue'

import { signInWithEmailPassword } from '../api/sign-in-with-email-password'

/**
 * Runs sign-in via {@link loginUserAccount}.
 *
 * @param email - User email address
 * @param password - User password
 * @returns `true` if sign-in succeeded, otherwise `false` (see `errorCode`)
 */
export function useLogin() {
  const errorCode = ref<string | null>(null)
  const loading = ref(false)

  function clearError() {
    errorCode.value = null
  }

  async function execute(email: string, password: string) {
    if (loading.value) {
      return false
    }

    loading.value = true
    clearError()

    try {
      const response = await signInWithEmailPassword(email, password)

      if (!response.success) {
        errorCode.value = response.error.code
        return false
      }

      return true
    } finally {
      loading.value = false
    }
  }

  return { execute, clearError, errorCode, loading }
}
