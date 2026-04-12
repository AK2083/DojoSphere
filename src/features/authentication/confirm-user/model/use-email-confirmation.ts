import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRegisterEmailFromStorage } from '../../register-user/model/register-storage'
import { useResend } from './resend/use-resend'
import { useOtp } from './sending/use-otp'

/**
 * Feature composable for the email confirmation page.
 *
 * Keeps page components thin (feature-sliced): the page mainly binds UI to state
 * and delegates behavior to this composable.
 *
 * @returns {object} State and handler functions for the email confirmation flow.
 */
export function useEmailConfirmation() {
  const router = useRouter()
  const route = useRoute()

  const { execute: verifyOtp, errorCode: otpError } = useOtp()
  const {
    resend,
    errorCode: resendErrorCode,
    loading: resendLoading,
    success: resendSuccess
  } = useResend()
  const storedEmail = getRegisterEmailFromStorage()

  const email = computed(() => {
    const value = route.query.email
    if (Array.isArray(value)) return value[0] ?? ''
    if (typeof value === 'string') return value
    return storedEmail ?? ''
  })

  const otp = ref('')

  async function verifyOtpHandler() {
    const success = await verifyOtp(email.value, otp.value)
    if (!success) return

    router.push({ name: 'settings' })
  }

  async function resendConfirmation(): Promise<void> {
    if (!email.value) return
    await resend(email.value)
  }

  const alert = computed(() => {
    if (otpError.value) {
      return {
        type: 'error' as const,
        text: otpError.value
      }
    }

    if (resendErrorCode.value) {
      return {
        type: 'error' as const,
        text: resendErrorCode.value
      }
    }

    if (resendSuccess.value) {
      return {
        type: 'success' as const,
        text: 'auth.otp.resend.success'
      }
    }

    return null
  })

  return {
    email,
    otp,
    verifyOtp: verifyOtpHandler,
    resendConfirmation,

    errorCode: otpError,
    resendErrorCode,
    resendLoading,
    resendSuccess,

    alert
  }
}
