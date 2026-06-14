import { confirmUserDe } from '../confirm-user/i18n'
import { passwordForgottenDe } from '../password-forgotten/i18n'
import { registerUserDe } from '../register-user/i18n'
import { signInDe } from '../signin-user/i18n'

export default {
  invalid_credentials: 'Ungueltige E-Mail oder Passwort.',
  invalid_email: 'Bitte gib eine gueltige E-Mail-Adresse ein.',
  weak_password: 'Dein Passwort ist zu schwach. Bitte waehle ein staerkeres Passwort.',
  otp: {
    errorInvalid: 'Der eingegebene Code ist ungueltig. Bitte pruefe ihn und versuche es erneut.',
    errorExpired: 'Dieser Code ist abgelaufen. Bitte fordere einen neuen Code an.'
  },
  signIn: signInDe,
  registerUser: registerUserDe,
  confirmUser: confirmUserDe,
  passwordForgotten: passwordForgottenDe
}
