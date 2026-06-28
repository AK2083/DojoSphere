import { computed, type ComputedRef, type Ref, ref } from 'vue'

import { signInWithOneTimePassword } from '../../api/sign-in-with-otp'

type UseResendReturn = {
  errorCode: Ref<string | null>
  canResend: ComputedRef<boolean>
  loading: Ref<boolean>
  success: Ref<boolean>
  email: Ref<string>
  resend: () => Promise<boolean>
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
 * await resend()
 *
 * if (success.value) {
 *   console.log('OTP was sent successfully')
 * }
 */
export function useResendOneTimePassword(): UseResendReturn {
  const email = ref<string>('')

  const errorCode = ref<string | null>(null)
  const loading = ref(false)
  const success = ref(false)

  const canResend = computed(() => email.value.trim().length > 0)

  /**
   * Resends an OTP to the current email state.
   *
   * @returns Resolves to `true` if successful, otherwise `false`
   */
  async function resend(): Promise<boolean> {
    if (loading.value || !canResend.value) {
      return false
    }

    loading.value = true
    success.value = false
    try {
      const response = await signInWithOneTimePassword(email.value)

      if (!response.success) {
        errorCode.value = response.error.code
        return false
      }

      errorCode.value = null
      success.value = true

      return true
    } finally {
      loading.value = false
    }
  }

  return { resend, canResend, email, errorCode, loading, success }
}
