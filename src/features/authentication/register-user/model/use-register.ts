import { ref } from 'vue'
import { type AuthActionResult, signUpWithMailAndPassword } from '@shared/auth'

import { setIsOtpActiveToStorage, setRegisterEmailToStorage } from '../../model/register-storage'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

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
