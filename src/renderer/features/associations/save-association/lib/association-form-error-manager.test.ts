import { describe, expect, it } from 'vitest'

import {
  mapAssociationFormRule,
  translateAssociationFormError
} from './association-form-error-manager'
import { AssociationFormErrorCode } from './association-form-rules'

describe('association-form-error-manager', () => {
  const t = (key: string) => key

  it('translates known validation codes', () => {
    expect(translateAssociationFormError(AssociationFormErrorCode.REQUIRED, t)).toBe(
      'associations.saveAssociation.validation.required'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_EMAIL, t)).toBe(
      'associations.saveAssociation.validation.email.invalid'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_WEBSITE, t)).toBe(
      'associations.saveAssociation.validation.website.invalid'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_POSTAL_CODE, t)).toBe(
      'associations.saveAssociation.validation.postalCode.invalid'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_HOUSE_NUMBER, t)).toBe(
      'associations.saveAssociation.validation.houseNumber.invalid'
    )
    expect(
      translateAssociationFormError(AssociationFormErrorCode.INVALID_ASSOCIATION_NUMBER, t)
    ).toBe('associations.saveAssociation.validation.associationNumber.invalid')
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_PHONE, t)).toBe(
      'associations.saveAssociation.validation.phone.invalid'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.INVALID_CITY, t)).toBe(
      'associations.saveAssociation.validation.city.invalid'
    )
    expect(translateAssociationFormError(AssociationFormErrorCode.TEXT_TOO_LONG, t)).toBe(
      'associations.saveAssociation.validation.textTooLong'
    )
  })

  it('falls back to the required message for unknown codes', () => {
    expect(translateAssociationFormError('unknown' as never, t)).toBe(
      'associations.saveAssociation.validation.required'
    )
  })

  it('maps domain rules to vuetify-compatible rules', () => {
    const rule = mapAssociationFormRule(
      (value) => (value?.trim() ? true : AssociationFormErrorCode.REQUIRED),
      t
    )

    expect(rule('JC Nord')).toBe(true)
    expect(rule('')).toBe('associations.saveAssociation.validation.required')
    expect(rule(null)).toBe('associations.saveAssociation.validation.required')
    expect(rule(undefined)).toBe('associations.saveAssociation.validation.required')
    expect(rule(12)).toBe(true)
  })
})
