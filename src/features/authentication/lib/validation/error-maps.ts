import { translationKeys } from '../../i18n/keys'

export const emailErrorMap = {
  required: translationKeys.form.mail.required,
  invalidEmail: translationKeys.form.mail.invalid
} as const

export const passwordErrorMap = {
  minLength: translationKeys.form.password.lessCharacters,
  missingLetter: translationKeys.form.password.noLetter
} as const
