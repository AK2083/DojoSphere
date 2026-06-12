import { ref } from 'vue'

import { signUpWithMailAndPassword } from '../api/sign-up-with-mail-and-password'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
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
    monitorInformation(MONITORING_EVENTS.REGISTER_EXECUTE_STARTED)

    if (loading.value) {
      monitorInformation(MONITORING_EVENTS.REGISTER_ALREADY_LOADING)
      return false
    }

    loading.value = true
    clearError()

    try {
      const response = await signUpWithMailAndPassword(email, password)

      if (!response.success) {
        monitorInformation(MONITORING_EVENTS.REGISTER_SIGN_UP_FAILED, {
          errorCode: response.error.code
        })

        errorCode.value = response.error.code
        return false
      }

      monitorInformation(MONITORING_EVENTS.REGISTER_SIGN_UP_SUCCEEDED)

      setIsOtpActiveToStorage(true)
      setRegisterEmailToStorage(email)

      monitorInformation(MONITORING_EVENTS.REGISTER_STORAGE_UPDATED)

      return true
    } finally {
      loading.value = false
    }
  }

  return { execute, clearError, errorCode, loading }
}
