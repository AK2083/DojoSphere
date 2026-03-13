import { describe, expect, it } from 'vitest'

import { translationKeys } from '../../i18n/keys'
import { emailErrorMap, passwordErrorMap } from './error-maps'

describe('emailErrorMap', () => {
  it('maps required error correctly', () => {
    expect(emailErrorMap.required).toBe(translationKeys.form.mail.required)
  })

  it('maps invalidEmail error correctly', () => {
    expect(emailErrorMap.invalidEmail).toBe(translationKeys.form.mail.invalid)
  })

  it('contains exactly the expected keys', () => {
    expect(Object.keys(emailErrorMap)).toEqual(['required', 'invalidEmail'])
  })
})

describe('passwordErrorMap', () => {
  it('maps minLength error correctly', () => {
    expect(passwordErrorMap.minLength).toBe(translationKeys.form.password.lessCharacters)
  })

  it('maps missingLetter error correctly', () => {
    expect(passwordErrorMap.missingLetter).toBe(translationKeys.form.password.noLetter)
  })

  it('contains exactly the expected keys', () => {
    expect(Object.keys(passwordErrorMap)).toEqual(['minLength', 'missingLetter'])
  })
})
