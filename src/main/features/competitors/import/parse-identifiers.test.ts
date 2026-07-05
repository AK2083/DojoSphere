import { describe, expect, it } from 'vitest'

import {
  isAreaHeader,
  isClubHeader,
  isContactPersonHeader,
  isLicenseNumberHeader,
  isNationalityHeader,
  isPassNumberHeader,
  isRegistrationStatusHeader,
  isEventMetadataHeader
} from './parse-identifiers'

describe('parse-identifiers', () => {
  it('detects pass number headers', () => {
    expect(isPassNumberHeader('Pass-Nr.')).toBe(true)
    expect(isPassNumberHeader('Pass.-Nr.')).toBe(true)
    expect(isPassNumberHeader('Pass Nr')).toBe(true)
    expect(isPassNumberHeader('Passnummer')).toBe(true)
    expect(isPassNumberHeader('Pass-Ausweis')).toBe(true)
  })

  it('does not treat generic Nr. as pass number', () => {
    expect(isPassNumberHeader('Nr.')).toBe(false)
  })

  it('detects license number headers', () => {
    expect(isLicenseNumberHeader('Lizenz-Nr.')).toBe(true)
    expect(isLicenseNumberHeader('Wettkampflizenznummer')).toBe(true)
    expect(isLicenseNumberHeader('Lizenznummer')).toBe(true)
  })

  it('does not treat generic Wettkampflizenz or event metadata as license headers', () => {
    expect(isLicenseNumberHeader('Wettkampflizenz')).toBe(false)
    expect(isLicenseNumberHeader('Wettkampftag')).toBe(false)
    expect(isEventMetadataHeader('Wettkampftag')).toBe(true)
  })

  it('does not treat pass headers as license headers', () => {
    expect(isLicenseNumberHeader('Pass-Nr.')).toBe(false)
  })

  it('detects registration status headers', () => {
    expect(isRegistrationStatusHeader('Status')).toBe(true)
    expect(isRegistrationStatusHeader('Meldestatus')).toBe(true)
    expect(isRegistrationStatusHeader('Anmeldung')).toBe(true)
  })

  it('detects nationality headers', () => {
    expect(isNationalityHeader('Nationalität')).toBe(true)
    expect(isNationalityHeader('Nation')).toBe(true)
    expect(isNationalityHeader('Staatsangehörigkeit')).toBe(true)
    expect(isNationalityHeader('Nat')).toBe(true)
  })

  it('does not confuse status and nationality headers', () => {
    expect(isNationalityHeader('Status')).toBe(false)
    expect(isRegistrationStatusHeader('Nationalität')).toBe(false)
  })

  it('does not treat club supervisor email headers as club columns', () => {
    expect(isClubHeader('E-Mail Vereinsverantwortlicher')).toBe(false)
  })

  it('detects club headers and excludes area columns', () => {
    expect(isClubHeader('Verein/Club')).toBe(true)
    expect(isClubHeader('Meldender Verein')).toBe(true)
    expect(isAreaHeader('Bereich')).toBe(true)
    expect(isClubHeader('Bereich')).toBe(false)
  })

  it('returns false for empty header labels', () => {
    expect(isPassNumberHeader('')).toBe(false)
    expect(isLicenseNumberHeader('   ')).toBe(false)
    expect(isRegistrationStatusHeader('')).toBe(false)
    expect(isNationalityHeader('')).toBe(false)
    expect(isAreaHeader('')).toBe(false)
    expect(isClubHeader('')).toBe(false)
    expect(isContactPersonHeader('')).toBe(false)
  })

  it('detects contact person headers from competition-day labels', () => {
    expect(isContactPersonHeader('Kontaktperson')).toBe(true)
    expect(isContactPersonHeader('Coach / Kontakt am Wettkampftag')).toBe(true)
    expect(isContactPersonHeader('Coach Kontakt')).toBe(true)
    expect(isContactPersonHeader('Trainer')).toBe(false)
  })
})
