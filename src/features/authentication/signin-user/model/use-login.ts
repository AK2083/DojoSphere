import { ref } from 'vue'
import { type AuthActionResult, signInWithEmailPassword } from '@shared/auth'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

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

  async function execute(email: string, password: string) {
    loading.value = true

    const response = await loginUserAccount(email, password)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    return true
  }

  return { execute, errorCode, loading }
}

/**
 * Executes the email/password sign-in use case.
 *
 * Records a monitoring breadcrumb and delegates authentication to the
 * Supabase API wrapper {@link signInWithEmailPassword}.
 *
 * @param email - User email address
 * @param password - User password
 * @returns A promise resolving to the sign-in result (success or mapped error).
 */
export function loginUserAccount(email: string, password: string): Promise<AuthActionResult> {
  monitorInformation(MONITORING_EVENTS.AUTH_LOGIN_SUBMITTED)
  return signInWithEmailPassword(email, password)
}
