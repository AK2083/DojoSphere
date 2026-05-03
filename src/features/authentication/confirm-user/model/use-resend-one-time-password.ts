import { computed, type ComputedRef, type Ref, ref } from 'vue'
import { resendSignUpConfirmationEmail } from '@shared/auth'
import type { RegisterResult } from '@shared/types'

import { getRegisterEmailFromStorage } from '../../model/register-storage'
import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

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

  /**
   * Resends an OTP to the given email address.
   *
   * @param email - The email address to send the OTP to
   * @returns Resolves to `true` if successful, otherwise `false`
   */
  async function resend(): Promise<boolean> {
    loading.value = true
    success.value = false

    const storedEmail = getRegisterEmailFromStorage()

    if (!email.value) {
      email.value = storedEmail ?? ''
    }

    const response = await resendOtp(email.value)

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

/**
 * Triggers resend of the sign-up confirmation mail and records monitoring data.
 *
 * @param {string} email - The email address to resend confirmation to.
 * @returns {Promise<RegisterResult>} Result of resend attempt.
 */
export function resendOtp(email: string): Promise<RegisterResult> {
  monitorInformation(MONITORING_EVENTS.RESEND_OTP)
  return resendSignUpConfirmationEmail(email)
}
