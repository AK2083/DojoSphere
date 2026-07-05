import { normalizeHeader } from './normalize-text'
import { isExcludedImportSourceLabel } from '@shared/domain/competitor-import-fields'
import { isEmailHeader } from './parse-email'

/**
 * Returns whether a header label refers to a judo pass number column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to a pass number column.
 */
export function isPassNumberHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  if (normalized === 'passnummer' || normalized === 'judopass' || normalized === 'passnr') {
    return true
  }

  return (
    normalized.includes('pass') &&
    (normalized.includes('nr') ||
      normalized.includes('nummer') ||
      normalized.includes('number') ||
      normalized.includes('ausweis'))
  )
}

/**
 * Returns whether a header label refers to a competition license number column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to a license number column.
 */
export function isLicenseNumberHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  if (normalized === 'wettkampflizenznummer' || normalized === 'lizenznummer') {
    return true
  }

  return (
    (normalized.includes('lizenz') ||
      normalized.includes('licence') ||
      normalized.includes('license')) &&
    (normalized.includes('nr') ||
      normalized.includes('nummer') ||
      normalized.includes('number') ||
      normalized.includes('no'))
  )
}

/**
 * Returns whether a header label refers to the registration status column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to registration status.
 */
export function isRegistrationStatusHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  return (
    normalized.includes('status') ||
    normalized.includes('meldung') ||
    normalized.includes('anmeldung')
  )
}

/**
 * Returns whether a header label refers to the nationality column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to nationality.
 */
export function isNationalityHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  return (
    normalized.includes('national') ||
    normalized.includes('staatsangehor') ||
    normalized === 'nation' ||
    normalized === 'land' ||
    normalized === 'nat' ||
    normalized === 'country' ||
    normalized === 'citizenship'
  )
}

/**
 * Returns whether a header label belongs to tournament registration metadata
 * rather than a per-participant column.
 *
 * @param header - Column or form label text.
 * @returns True when the header is tournament registration metadata.
 */
export function isEventMetadataHeader(header: string): boolean {
  return isExcludedImportSourceLabel(header)
}

/**
 * Returns whether a header label refers to a competition area/region column
 * rather than a club name.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to a competition area or region.
 */
export function isAreaHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  return (
    normalized === 'bereich' ||
    normalized.includes('region') ||
    normalized === 'gebiet' ||
    normalized === 'area' ||
    normalized.includes('areal')
  )
}

/**
 * Returns whether a header label refers to a participant club column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to a club column.
 */
export function isClubHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized || isAreaHeader(header) || isEmailHeader(header)) {
    return false
  }

  if (
    normalized.includes('meldenderverein') ||
    normalized.includes('vereinclub') ||
    normalized === 'vereinsname'
  ) {
    return true
  }

  return (
    normalized.includes('verein') ||
    normalized.includes('club') ||
    normalized.includes('dojo') ||
    normalized.includes('mannschaft')
  )
}

/**
 * Returns whether a header label refers to the participant contact person column.
 *
 * @param header - Column or form label text.
 * @returns True when the header refers to a contact person column.
 */
export function isContactPersonHeader(header: string): boolean {
  const normalized = normalizeHeader(header)

  if (!normalized) {
    return false
  }

  if (normalized.includes('kontaktperson')) {
    return true
  }

  return (
    (normalized.includes('kontakt') && normalized.includes('wettkampftag')) ||
    (normalized.includes('coach') && normalized.includes('kontakt'))
  )
}
