export const emailRules = [
  (v?: string) => !!v || 'E-mail is required.',
  (v?: string) => /.+@.+\..+/.test(v ?? '') || 'E-mail must be valid.'
]

export const passwordRules = [
  (v?: string) =>
    (v ? v.length >= 8 : false) ||
    'Password must be at least 8 characters long.',

  (v?: string) =>
    /[A-Za-z]/.test(v ?? '') || 'Password must contain at least one letter.'
]
