export const PASSWORD_MIN_LENGTH = 12;

export const emailRules = [
  (v?: string) => !!v || 'required',
  (v?: string) => /.+@.+\..+/.test(v ?? '') || 'invalidEmail'
]

export const passwordRules = [
  (v?: string) => (v ? v.length >= PASSWORD_MIN_LENGTH : false) || 'minLength',
  (v?: string) => /[A-Za-z]/.test(v ?? '') || 'missingLetter'
]
