import { resendOtp } from './resend-otp'

type UseResendReturn = {
  errorCode: Ref<string | null>
  loading: Ref<boolean>
  success: Ref<boolean>
  resend: (email: string) => Promise<boolean>
}

/**
 * Composable for resending a One-Time Password (OTP).
 *
 * Provides reactive state for loading, success, and error handling.
 *
 * @returns {UseResendReturn} Object containing resend function, errorCode, loading, and success state.
 * @example
 * const { resend, loading, success, errorCode } = useResend()
 *
 * await resend('test@example.com')
 *
 * if (success.value) {
 *   console.log('OTP was sent successfully')
 * }
 */
export function useResend(): UseResendReturn {
  const errorCode = ref<string | null>(null)
  const loading = ref(false)
  const success = ref(false)

  /**
   * Resends an OTP to the given email address.
   *
   * @param email - The email address to send the OTP to
   * @returns Resolves to `true` if successful, otherwise `false`
   */
  async function resend(email: string) {
    loading.value = true
    success.value = false

    const response = await resendOtp(email)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    success.value = true
    return true
  }

  return { resend, errorCode, loading, success }
}
