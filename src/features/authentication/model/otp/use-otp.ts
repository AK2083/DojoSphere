import { ref } from 'vue'

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

  return { execute, errorCode, loading }
}
