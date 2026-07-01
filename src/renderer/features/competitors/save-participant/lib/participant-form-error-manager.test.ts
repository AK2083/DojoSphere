import { describe, expect, it, vi } from 'vitest'

import {
  mapParticipantFormRule,
  translateParticipantFormError
} from './participant-form-error-manager'
import {
  optionalPhoneRule,
  ParticipantFormErrorCode,
  passNumberRule,
  requiredFieldRule
} from './participant-form-rules'

describe('participant-form-error-manager', () => {
  it('translates participant form error codes', () => {
    const t = vi.fn((key: string) => key)

    expect(translateParticipantFormError(ParticipantFormErrorCode.REQUIRED, t)).toBe(
      'competitors.saveParticipant.validation.required'
    )
    expect(translateParticipantFormError(ParticipantFormErrorCode.INVALID_PASS_NUMBER, t)).toBe(
      'competitors.saveParticipant.validation.passNumber.invalid'
    )
  })

  it('maps rules to translated validation messages', () => {
    const t = vi.fn((key: string) => `translated:${key}`)
    const mapped = mapParticipantFormRule(
      (value) => (value?.trim() ? true : ParticipantFormErrorCode.REQUIRED),
      t
    )

    expect(mapped('')).toBe('translated:competitors.saveParticipant.validation.required')
    expect(mapped('value')).toBe(true)
    expect(mapParticipantFormRule(optionalPhoneRule, t)(null)).toBe(true)
    expect(mapParticipantFormRule(() => true, t)(42)).toBe(true)
    expect(mapParticipantFormRule(requiredFieldRule, t)(undefined)).toBe(
      'translated:competitors.saveParticipant.validation.required'
    )
    expect(mapParticipantFormRule(passNumberRule, t)('invalid id')).toBe(
      'translated:competitors.saveParticipant.validation.passNumber.invalid'
    )
  })
})
