const translationKeys = {
  title: 'title',
  description: 'description',
  steps: {
    email: {
      title: 'steps.email.title',
      label: 'steps.email.label',
      placeholder: 'steps.email.placeholder',
      ariaLabel: 'steps.email.ariaLabel'
    },
    otp: {
      title: 'steps.otp.title',
      description: 'steps.otp.description',
      ariaLabel: 'steps.otp.ariaLabel',
      resend: {
        resendLabel: 'steps.otp.resend.resendLabel',
        ariaResendLabel: 'steps.otp.resend.ariaResendLabel',
        success: 'steps.otp.resend.success'
      },
      error: {
        expired: 'steps.otp.error.expired',
        invalid: 'steps.otp.error.invalid'
      }
    },
    newPassword: {
      title: 'steps.newPassword.title',
      description: 'steps.newPassword.description',
      passwordLabel: 'steps.newPassword.passwordLabel',
      ariaPasswordLabel: 'steps.newPassword.ariaPasswordLabel',
      newPasswordLabel: 'steps.newPassword.newPasswordLabel',
      ariaNewPasswordLabel: 'steps.newPassword.ariaNewPasswordLabel',
      error: {
        mismatch: 'steps.newPassword.error.mismatch'
      }
    }
  },
  nextLabel: 'nextLabel',
  ariaNextLabel: 'ariaNextLabel',
  cancelLabel: 'cancelLabel',
  ariaCancelLabel: 'ariaCancelLabel'
}

export default translationKeys
