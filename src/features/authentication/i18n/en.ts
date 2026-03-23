export default {
  email_exists: 'This email address is already registered.',
  invalid_credentials: 'Invalid email or password.',
  useLocal: {
    title: 'Local Login',
    subtitle: "Don't feel like registering?",
    description:
      'Continue working locally. All data is stored locally and not synchronized with a server.',
    submit: 'Continue without registration'
  },
  login: {
    title: 'Login',
    description: 'Sign in to your account',
    submit: 'Log in',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account yet?",
    register: 'Register now'
  },
  welcome: {
    title: 'Welcome'
  },
  navigation: {
    accountGuestAria: 'Account, registration, or email confirmation',
    accountLoggedInAria: 'My account',
    accountGuestTitle: 'Account',
    accountLoggedInTitle: 'Profile'
  },
  account: {
    greeting: 'Bye, {name}',
    fallbackName: 'User'
  },
  form: {
    title: 'Registration',
    description: 'Register a new user',
    alreadyAccount: 'Already have an account?',
    logMeIn: 'Log in here',
    mail: {
      title: 'E-Mail',
      placeholder: 'Your E-Mail Address'
    },
    password: {
      title: 'Password',
      displayToggle: 'Show or hide password'
    },
    submit: 'Register me'
  },
  otp: {
    title: 'Confirm Email',
    description: 'Please enter the confirmation code we have sent to your email address.',
    codeAria: 'Confirmation code',
    resendMailButton: 'Send me a new confirmation',
    errorExpired: 'This confirmation code has expired. Please request a new code below.',
    errorInvalid: 'The code you entered is invalid. Please check it and try again.'
  },
  success: {
    title: 'Register successful',
    description:
      'We have sent you a confirmation email. Please check your inbox to activate your account.',
    resendMail: 'Resend email'
  },
  resetPassword: {
    title: 'Reset your password',
    description: 'Request a confirmation code and set a new password',
    steps: {
      email: 'E-Mail',
      otp: 'Confirmation code',
      newPassword: 'New password'
    },
    cancel: 'Cancel',
    resendOtpButton: 'Resend code',
    next: {
      email: 'Continue',
      otp: 'Verify code',
      finish: 'Finish'
    },
    password: {
      repeatTitle: 'Repeat password',
      mismatch: 'Passwords do not match.'
    }
  }
}
