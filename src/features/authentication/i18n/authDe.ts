import { confirmUserDe } from '../confirm-user/i18n'
import { passwordForgottenDe } from '../password-forgotten/i18n'
import { registerUserDe } from '../register-user/i18n'
import { signInDe } from '../signin-user/i18n'
import { workLocalDe } from '../work-local/i18n'
import commonAuthDe from './de'

export default {
  invalid_credentials: commonAuthDe.invalid_credentials,
  invalid_email: commonAuthDe.invalid_email,
  weak_password: commonAuthDe.weak_password,
  otp: commonAuthDe.otp,
  common: commonAuthDe,
  workLocal: workLocalDe,
  signIn: signInDe,
  registerUser: registerUserDe,
  confirmUser: confirmUserDe,
  passwordForgotten: passwordForgottenDe
}
