const translationKeys = {
  steps: {
    title: 'auth.passwordForgotten.steps.title',
    description: 'auth.passwordForgotten.steps.description',
    email: {
      title: 'auth.passwordForgotten.steps.email.title',
      description: 'auth.passwordForgotten.steps.email.description',
      label: 'auth.passwordForgotten.steps.email.label',
      placeholder: 'auth.passwordForgotten.steps.email.placeholder',
      ariaLabel: 'auth.passwordForgotten.steps.email.ariaLabel'
    },
    otp: {
      title: 'auth.passwordForgotten.steps.otp.title',
      description: 'auth.passwordForgotten.steps.otp.description',
      ariaLabel: 'auth.passwordForgotten.steps.otp.ariaLabel',
      resend: {
        resendLabel: 'auth.passwordForgotten.steps.otp.resend.resendLabel',
        ariaResendLabel: 'auth.passwordForgotten.steps.otp.resend.ariaResendLabel',
        success: 'auth.passwordForgotten.steps.otp.resend.success'
      },
      error: {
        expired: 'auth.passwordForgotten.steps.otp.error.expired',
        invalid: 'auth.passwordForgotten.steps.otp.error.invalid'
      }
    },
    newPassword: {
      title: 'auth.passwordForgotten.steps.newPassword.title',
      description: 'auth.passwordForgotten.steps.newPassword.description',
      passwordLabel: 'auth.passwordForgotten.steps.newPassword.passwordLabel',
      ariaPasswordLabel: 'auth.passwordForgotten.steps.newPassword.ariaPasswordLabel',
      newPasswordLabel: 'auth.passwordForgotten.steps.newPassword.newPasswordLabel',
      ariaNewPasswordLabel: 'auth.passwordForgotten.steps.newPassword.ariaNewPasswordLabel',
      error: {
        mismatch: 'auth.passwordForgotten.steps.newPassword.error.mismatch'
      }
    }
  },
  nextLabel: 'auth.passwordForgotten.nextLabel',
  ariaNextLabel: 'auth.passwordForgotten.ariaNextLabel',
  cancelLabel: 'auth.passwordForgotten.cancelLabel',
  ariaCancelLabel: 'auth.passwordForgotten.ariaCancelLabel'
}

export default translationKeys
