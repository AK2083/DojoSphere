import { onMounted, ref } from 'vue'
import router from '@app/providers/router'
import { getCurrentSession } from '@features/authentication/service/get-current-session'
import { navigateToDashboard } from '@features/authentication/service/navigate-to-dashboard'
import { clearIsOtpActiveFromStorage } from '@features/authentication/service/register-storage'

import { checkOneTimePassword } from '../api/check-one-time-password'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'
import {
  clearRegisterEmailFromStorage,
  getRegisterEmailFromStorage
} from '../service/register-storage'

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
    monitorInformation(MONITORING_EVENTS.STORAGE_REGISTER_EMAIL_READ)
    const storedEmail = getRegisterEmailFromStorage()
    const session = await getCurrentSession()

    email.value = session?.user?.email ?? storedEmail ?? ''
  })

  async function send() {
    monitorInformation(MONITORING_EVENTS.CHECK_OTP_SUBMITTED)
    const storedEmail = getRegisterEmailFromStorage()

    if (!token.value) {
      monitorInformation(MONITORING_EVENTS.CHECK_OTP_VALIDATION_FAILED, {
        reason: 'missing_token'
      })
      return false
    }

    if (!email.value) {
      monitorInformation(MONITORING_EVENTS.CHECK_OTP_VALIDATION_FAILED, {
        reason: 'missing_email'
      })
      email.value = storedEmail ?? ''
      return false
    }

    errorCode.value = null
    loading.value = true
    success.value = false

    monitorInformation(MONITORING_EVENTS.CHECK_OTP_REQUEST_STARTED)
    const response = await checkOneTimePassword(email.value, token.value)

    loading.value = false

    if (!response.success) {
      monitorInformation(MONITORING_EVENTS.CHECK_OTP_FAILED, {
        errorCode: response.error.code
      })

      errorCode.value = response.error.code
      return false
    }

    monitorInformation(MONITORING_EVENTS.CHECK_OTP_SUCCEEDED)

    success.value = true
    clearIsOtpActiveFromStorage()
    clearRegisterEmailFromStorage()

    await navigateToDashboard(router)

    return true
  }

  return {
    send,
    email,
    token,
    errorCode,
    loading,
    success
  }
}
