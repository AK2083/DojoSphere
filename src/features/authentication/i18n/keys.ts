export const translationKeys = {
  useLocal: {
    title: 'auth.useLocal.title',
    subtitle: 'auth.useLocal.subtitle',
    description: 'auth.useLocal.description',
    submit: 'auth.useLocal.submit'
  },
  login: {
    title: 'auth.login.title',
    description: 'auth.login.description',
    submit: 'auth.login.submit',
    forgotPassword: 'auth.login.forgotPassword',
    noAccount: 'auth.login.noAccount',
    register: 'auth.login.register'
  },
  welcome: {
    title: 'auth.welcome.title'
  },
  navigation: {
    accountGuestAria: 'auth.navigation.accountGuestAria',
    accountLoggedInAria: 'auth.navigation.accountLoggedInAria',
    accountGuestTitle: 'auth.navigation.accountGuestTitle',
    accountLoggedInTitle: 'auth.navigation.accountLoggedInTitle'
  },
  account: {
    greeting: 'auth.account.greeting',
    fallbackName: 'auth.account.fallbackName'
  },
  form: {
    title: 'auth.form.title',
    description: 'auth.form.description',
    alreadyAccount: 'auth.form.alreadyAccount',
    logMeIn: 'auth.form.logMeIn',
    mail: {
      title: 'auth.form.mail.title',
      placeholder: 'auth.form.mail.placeholder',
      required: 'auth.form.mail.required',
      invalid: 'auth.form.mail.invalid'
    },
    password: {
      title: 'auth.form.password.title',
      invalid: 'auth.form.password.invalid',
      lessCharacters: 'auth.form.password.lessCharacters',
      noLetter: 'auth.form.password.noLetter',
      displayToggle: 'auth.form.password.displayToggle'
    },
    submit: 'auth.form.submit',
    error: {
      retry: 'auth.form.error.retry',
      unknown: 'auth.form.error.unknown'
    }
  },
  otp: {
    title: 'auth.otp.title',
    description: 'auth.otp.description',
    codeAria: 'auth.otp.codeAria',
    resendMailButton: 'auth.otp.resendMailButton',
    errorExpired: 'auth.otp.errorExpired',
    errorInvalid: 'auth.otp.errorInvalid'
  },
  success: {
    title: 'auth.success.title',
    description: 'auth.success.description',
    resendMail: 'auth.success.resendMail'
  },
  resetPassword: {
    title: 'auth.resetPassword.title',
    description: 'auth.resetPassword.description',
    steps: {
      email: 'auth.resetPassword.steps.email',
      otp: 'auth.resetPassword.steps.otp',
      newPassword: 'auth.resetPassword.steps.newPassword'
    },
    cancel: 'auth.resetPassword.cancel',
    resendOtpButton: 'auth.resetPassword.resendOtpButton',
    next: {
      email: 'auth.resetPassword.next.email',
      otp: 'auth.resetPassword.next.otp',
      finish: 'auth.resetPassword.next.finish'
    },
    password: {
      repeatTitle: 'auth.resetPassword.password.repeatTitle',
      mismatch: 'auth.resetPassword.password.mismatch'
    }
  }
} as const
