export default {
  useLocal: {
    title: 'Local Login',
    subtitle: "Don't feel like registering?",
    description:
      'Continue working locally. All data is stored locally and not synchronized with a server.',
    submit: 'Continue without registration'
  },
  form: {
    title: 'Registration',
    description: 'Register a new user',
    alreadyAccount: 'Already have an account?',
    logMeIn: 'Log in here',
    mail: {
      title: 'E-Mail',
      placeholder: 'Your E-Mail Address',
      required: 'E-Mail is required.',
      invalid: 'Invalid email address'
    },
    password: {
      title: 'Password',
      invalid: 'Invalid Password',
      lessCharacters: 'Password must be at least 8 characters long.',
      noLetter: 'Password must contain at least one letter.',
      displayToggle: 'Show or hide password'
    },
    submit: 'Register me',
    error: {
      retry: 'Too many attempts. Please try again later.',
      unknown: 'An unknown error occurred. Please try again later.'
    }
  },
  otp: {
    title: 'Confirm Email',
    description:
      'Please enter the confirmation code we have sent to your email address.'
  },
  success: {
    title: 'Register successful',
    description:
      'We have sent you a confirmation email. Please check your inbox to activate your account.',
    resendMail: 'Resend email'
  }
}
