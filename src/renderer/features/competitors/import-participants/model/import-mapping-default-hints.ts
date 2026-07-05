import {
  type ImportTargetFieldKey,
  usesImportDefaultWhenUnmapped
} from '@shared/domain/competitor-import-fields'

import saveParticipantTranslationKeys from '../../save-participant/i18n/keys'
import translationKeys from '../i18n/keys'

type Translate = (key: string) => string

/**
 * Returns a localized label for the repository default used when a field stays unmapped.
 *
 * @param fieldKey - Import target field key.
 * @param t - i18n translate function.
 * @returns Localized default label, or null when the field has no import default.
 */
export function importDefaultValueLabel(
  fieldKey: ImportTargetFieldKey,
  t: Translate
): string | null {
  if (!usesImportDefaultWhenUnmapped(fieldKey)) {
    return null
  }

  switch (fieldKey) {
    case 'gender':
      return t(saveParticipantTranslationKeys.gender.female)
    case 'nationality':
      return t(saveParticipantTranslationKeys.reference.nationalities.DE)
    case 'birthDate':
      return t(translationKeys.steps.mapping.defaultValues.birthDate)
    case 'passNumber':
      return t(translationKeys.steps.mapping.defaultValues.passNumber)
    case 'club':
      return t(saveParticipantTranslationKeys.reference.clubs.unknown)
    default:
      return null
  }
}
