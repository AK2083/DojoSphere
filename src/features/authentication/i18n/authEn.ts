import { confirmUserEn } from '../confirm-user/i18n'
import { passwordForgottenEn } from '../password-forgotten/i18n'
import { registerUserEn } from '../register-user/i18n'
import { signInEn } from '../signin-user/i18n'
import { workLocalEn } from '../work-local/i18n'
import commonAuthEn from './en'

export default {
  invalid_credentials: commonAuthEn.invalid_credentials,
  invalid_email: commonAuthEn.invalid_email,
  weak_password: commonAuthEn.weak_password,
  otp: commonAuthEn.otp,
  common: commonAuthEn,
  workLocal: workLocalEn,
  signIn: signInEn,
  registerUser: registerUserEn,
  confirmUser: confirmUserEn,
  passwordForgotten: passwordForgottenEn
}
