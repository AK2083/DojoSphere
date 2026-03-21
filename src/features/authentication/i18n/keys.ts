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
    forgotPassword: 'auth.login.forgotPassword'
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
    resendMailButton: 'auth.otp.resendMailButton'
  },
  success: {
    title: 'auth.success.title',
    description: 'auth.success.description',
    resendMail: 'auth.success.resendMail'
  }
} as const
