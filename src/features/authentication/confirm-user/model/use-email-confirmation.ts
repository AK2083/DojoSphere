import { getRegisterEmailFromStorage } from '../../register-user/model/register-storage'

/**
 * Composable for handling email confirmation during user registration.
 * Provides functions to retrieve the email from storage and redirect after confirmation.
 * @returns Object containing `getStorageEMail` and `redirect` functions.
 * @example
 * const { getStorageEMail, redirect } = useEmailConfirmation()
 *
 * const email = getStorageEMail()
 * if (email) {
 *   // Show email to user or use it for OTP verification
 * }
 *
 * // After successful confirmation
 * redirect()
 */
export function useEmailConfirmation() {
  function getStorageEMail() {
    return getRegisterEmailFromStorage()
  }

  // const alert = computed(() => {
  //   if (otpError.value) {
  //     return {
  //       type: 'error' as const,
  //       text: otpError.value
  //     }
  //   }

  //   // if (resendErrorCode.value) {
  //   //   return {
  //   //     type: 'error' as const,
  //   //     text: resendErrorCode.value
  //   //   }
  //   // }

  //   // if (resendSuccess.value) {
  //   //   return {
  //   //     type: 'success' as const,
  //   //     text: 'auth.otp.resend.success'
  //   //   }
  //   // }

  //   return null
  // })

  return { getStorageEMail }
}
