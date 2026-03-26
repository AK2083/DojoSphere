export default {
  title: '',
  description: '',
  steps: {
    title: 'Reset password',
    description: 'You can reset your password here.',
    email: {
      title: 'Enter your email address',
      label: 'E-Mail',
      placeholder: 'Your E-Mail Address',
      ariaLabel: 'E-Mail'
    },
    otp: {
      title: 'Enter verification code',
      description: 'Please enter the confirmation code we have sent to your email address.',
      ariaLabel: 'Enter verification code',
      resend: {
        resendLabel: 'Send me a new confirmation code',
        ariaResendLabel: 'Send me a new confirmation code',
        success: 'Confirmation code was successfully sent.'
      },
      error: {
        expired: 'This confirmation code has expired. Please request a new code below.',
        invalid: 'The code you entered is invalid. Please check it and try again.'
      }
    },
    newPassword: {
      title: 'Reset your password',
      description: 'Request a confirmation code and set a new password.',
      passwordLabel: 'New password',
      ariaPasswordLabel: 'New password',
      newPasswordLabel: 'Repeat password',
      ariaNewPasswordLabel: 'Repeat password',
      error: {
        mismatch: 'Passwords do not match!'
      }
    }
  },
  nextLabel: 'Continue',
  ariaNextLabel: 'Continue',
  cancelLabel: 'Cancel',
  ariaCancelLabel: 'Cancel'
}
