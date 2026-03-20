import { ref } from 'vue'

import { resendOtp } from './resend-otp'
import { verifyOtp } from './verify-otp'
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
 *
 * @example
 * const { execute, errorCode, loading } = useOtp()
 *
 * const success = await execute('user@example.com', '123456')
 * if (!success) {
 *   console.error(errorCode.value)
 * }
 */
export function useOtp() {
  const errorCode = ref<string | null>(null)
  const loading = ref(false)
  const resendErrorCode = ref<string | null>(null)
  const resendLoading = ref(false)
  const resendSuccess = ref(false)

  async function execute(email: string, token: string) {
    loading.value = true

    const response = await verifyOtp(email, token)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    return true
  }

  async function resend(email: string) {
    resendLoading.value = true
    resendSuccess.value = false

    const response = await resendOtp(email)

    resendLoading.value = false

    if (!response.success) {
      resendErrorCode.value = response.error.code
      return false
    }

    resendErrorCode.value = null
    resendSuccess.value = true
    return true
  }

  return { execute, errorCode, loading, resend, resendErrorCode, resendLoading, resendSuccess }
}
