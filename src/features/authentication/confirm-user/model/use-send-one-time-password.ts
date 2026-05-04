import { onMounted, ref } from 'vue'
import router from '@app/providers/router'
import { type AuthActionResult, checkOneTimePassword, getCurrentSession } from '@shared/auth'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import { getRegisterEmailFromStorage } from './register-storage'

/**
 * Composable for handling OTP (one-time password) verification.
 *
 * Manages loading state and error codes, and provides an `execute`
 * function to verify a token for a given email.
 *
 * @returns Object containing:
 * - `execute`: Triggers OTP verification and returns whether it succeeded.
 * - `errorCode`: Contains the error code if verification fails, otherwise `null`.
 * - `loading`: Indicates whether the request is in progress.
 * - `success`: Indicates whether the verification succeeded.
 */
export function useSendOneTimePassword() {
  const email = ref<string>('')
  const token = ref<string>('')

  const errorCode = ref<string | null>(null)
  const loading = ref(false)
  const success = ref(false)

  onMounted(async () => {
    const storedEmail = getRegisterEmailFromStorage()
    const session = await getCurrentSession()

    email.value = session?.user?.email ?? storedEmail ?? ''
  })

  async function execute() {
    const storedEmail = getRegisterEmailFromStorage()

    if (!token.value) {
      return false
    }

    if (!email.value) {
      email.value = storedEmail ?? ''
    }

    loading.value = true
    success.value = false

    const response = await verifyOtp(email.value, token.value)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    success.value = true

    await router.push({ name: 'settings' })

    return true
  }

  return {
    execute,
    email,
    token,
    errorCode,
    loading,
    success
  }
}

/**
 * Registers a user account by validating a one-time password (OTP).
 *
 * This function triggers a monitoring event for a verification attempt
 * and then verifies the provided token against the given email.
 *
 * @param email - The user's email address used for registration.
 * @param token - The one-time password (OTP) or verification token.
 * @returns A promise that resolves with the result of the registration process.
 */
export function verifyOtp(email: string, token: string): Promise<AuthActionResult> {
  monitorInformation(MONITORING_EVENTS.CHECK_OTP)

  return checkOneTimePassword(email, token)
}
