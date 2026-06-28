import { ref } from 'vue'

import { signUpWithMailAndPassword } from '../api/sign-up-with-mail-and-password'
import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from '../service/register-storage'

/**
 * Composable for registering a new user account.
 *
 * Handles:
 * - loading state
 * - error state for UI consumption
 *
 * @returns Object containing execute function, errorCode and loading state
 *
 * @example
 * const { execute, errorCode, loading } = useRegister()
 */
export function useRegister() {
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
      const response = await signUpWithMailAndPassword(email, password)

      if (!response.success) {
        errorCode.value = response.error.code
        return false
      }

      setIsOtpActiveToStorage(true)
      setRegisterEmailToStorage(email)

      return true
    } finally {
      loading.value = false
    }
  }

  return { execute, clearError, errorCode, loading }
}
