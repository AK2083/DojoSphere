import { computed, type ComputedRef, onMounted, type Ref, ref } from 'vue'

import { resendSignUpConfirmationEmail } from '../api/resend-sign-up-confirmation'
import { getRegisterEmailFromStorage } from '../service/register-storage'

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
 * await resend('test@example.com')
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

  onMounted(() => {
    email.value = getRegisterEmailFromStorage() ?? ''
  })

  /**
   * Resends an OTP to the given email address.
   *
   * @param email - The email address to send the OTP to
   * @returns Resolves to `true` if successful, otherwise `false`
   */
  async function resend(): Promise<boolean> {
    errorCode.value = null
    loading.value = true
    success.value = false

    const storedEmail = getRegisterEmailFromStorage()

    if (!email.value) {
      email.value = storedEmail ?? ''
      loading.value = false
      return false
    }

    const response = await resendSignUpConfirmationEmail(email.value)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    success.value = true

    return true
  }

  return { resend, canResend, email, errorCode, loading, success }
}
