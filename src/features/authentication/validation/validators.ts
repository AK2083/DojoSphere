export const emailRules = [
  (v?: string) => !!v || 'required',
  (v?: string) => /.+@.+\..+/.test(v ?? '') || 'invalidEmail'
]

export const passwordRules = [
  (v?: string) => (v ? v.length >= 8 : false) || 'minLength',
  (v?: string) => /[A-Za-z]/.test(v ?? '') || 'missingLetter'
]
