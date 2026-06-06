import { confirmUserEn } from '../confirm-user/i18n'
import { passwordForgottenEn } from '../password-forgotten/i18n'
import { registerUserEn } from '../register-user/i18n'
import { signInEn } from '../signin-user/i18n'
import { workLocalEn } from '../work-local/i18n'

export default {
  invalid_credentials: 'Invalid email or password.',
  invalid_email: 'Please enter a valid email address.',
  weak_password: 'Your password is too weak. Please choose a stronger one.',
  otp: {
    errorInvalid: 'The code you entered is invalid. Please check it and try again.',
    errorExpired: 'This code has expired. Please request a new code.'
  },
  workLocal: workLocalEn,
  signIn: signInEn,
  registerUser: registerUserEn,
  confirmUser: confirmUserEn,
  passwordForgotten: passwordForgottenEn
}
