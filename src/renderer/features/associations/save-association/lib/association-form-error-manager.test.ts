import { describe, expect, it } from 'vitest'

import { mapClubFormRule, translateClubFormError } from './club-form-error-manager'
import { ClubFormErrorCode } from './club-form-rules'

describe('club-form-error-manager', () => {
  const t = (key: string) => key

  it('translates known validation codes', () => {
    expect(translateClubFormError(ClubFormErrorCode.REQUIRED, t)).toBe(
      'clubs.saveClub.validation.required'
    )
    expect(translateClubFormError(ClubFormErrorCode.INVALID_EMAIL, t)).toBe(
      'clubs.saveClub.validation.email.invalid'
    )
    expect(translateClubFormError(ClubFormErrorCode.INVALID_WEBSITE, t)).toBe(
      'clubs.saveClub.validation.website.invalid'
    )
    expect(translateClubFormError(ClubFormErrorCode.INVALID_POSTAL_CODE, t)).toBe(
      'clubs.saveClub.validation.postalCode.invalid'
    )
    expect(translateClubFormError(ClubFormErrorCode.INVALID_PHONE, t)).toBe(
      'clubs.saveClub.validation.phone.invalid'
    )
    expect(translateClubFormError(ClubFormErrorCode.TEXT_TOO_LONG, t)).toBe(
      'clubs.saveClub.validation.textTooLong'
    )
  })

  it('maps domain rules to vuetify-compatible rules', () => {
    const rule = mapClubFormRule((value) => (value?.trim() ? true : ClubFormErrorCode.REQUIRED), t)

    expect(rule('JC Nord')).toBe(true)
    expect(rule('')).toBe('clubs.saveClub.validation.required')
    expect(rule(null)).toBe('clubs.saveClub.validation.required')
  })
})
