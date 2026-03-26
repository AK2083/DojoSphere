import { ref } from 'vue'

import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from './register-storage'
import { registerUserAccount } from './register-user-account'

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

  /**
   * Executes the user registration process.
   *
   * @param email - User email address
   * @param password - User password
   * @returns Promise resolving to `true` if registration was successful, otherwise `false`
   */
  async function execute(email: string, password: string) {
    loading.value = true

    const response = await registerUserAccount(email, password)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    setIsOtpActiveToStorage(true)
    setRegisterEmailToStorage(email)
    errorCode.value = null
    return true
  }

  return { execute, errorCode, loading }
}
