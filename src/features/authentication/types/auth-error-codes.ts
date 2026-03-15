export const EmailError = {
  REQUIRED: 'required',
  INVALID: 'invalidEmail'
} as const

export type EmailErrorCode = (typeof EmailError)[keyof typeof EmailError]

export const PasswordError = {
  MIN_LENGTH: 'minLength',
  MISSING_LETTER: 'missingLetter'
} as const

export type PasswordErrorCode = (typeof PasswordError)[keyof typeof PasswordError]
