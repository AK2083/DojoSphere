import { ref } from 'vue'
import type { AuthActionResult } from '@shared/types'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from './register-storage'
import { signUpWithMailAndPassword } from './sign-up-with-mail-and-password'

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

  /**
   * Executes the user registration process.
   *
   * @param email - User email address
   * @param password - User password
   * @returns Promise resolving to `true` if registration was successful, otherwise `false`
   */
  async function execute(email: string, password: string) {
    if (loading.value) return false

    loading.value = true
    clearError()

    try {
      const response = await registerUserAccount(email, password)

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

/**
 * Executes the user registration use case.
 *
 * Triggers a monitoring event and delegates the actual sign-up process
 * to the Supabase API wrapper.
 *
 * @param email - User email address
 * @param password - User password
 * @returns A promise resolving to the registration result indicating success or failure.
 */
export function registerUserAccount(email: string, password: string): Promise<AuthActionResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED)
  return signUpWithMailAndPassword(email, password)
}
