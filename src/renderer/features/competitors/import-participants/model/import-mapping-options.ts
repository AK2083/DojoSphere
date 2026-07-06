import type { ImportTargetFieldKey } from '@shared/domain/competitor-import-fields'

import overviewTranslationKeys from '../../get-participant-overview/i18n/keys'
import saveParticipantTranslationKeys from '../../save-participant/i18n/keys'
import translationKeys from '../i18n/keys'

/** i18n key for each import target field label shown in the mapping dropdowns. */
export const TARGET_FIELD_TRANSLATION_KEY: Record<ImportTargetFieldKey, string> = {
  givenName: saveParticipantTranslationKeys.form.fields.givenName,
  familyName: saveParticipantTranslationKeys.form.fields.familyName,
  gender: saveParticipantTranslationKeys.form.fields.gender,
  birthDate: saveParticipantTranslationKeys.form.fields.birthDate,
  club: saveParticipantTranslationKeys.form.fields.club,
  nationality: saveParticipantTranslationKeys.form.fields.nationality,
  weightKg: translationKeys.mapping.targetFields.weightKg,
  passNumber: saveParticipantTranslationKeys.form.fields.passNumber,
  grade: saveParticipantTranslationKeys.form.fields.grade,
  licenseNumber: saveParticipantTranslationKeys.form.fields.licenseNumber,
  contactPhone: saveParticipantTranslationKeys.form.fields.contactPhone,
  contactPerson: saveParticipantTranslationKeys.form.fields.contactPerson,
  clubContactEmail: overviewTranslationKeys.list.columns.clubContactEmail,
  startEligible: saveParticipantTranslationKeys.form.fields.startEligible,
  registrationStatus: saveParticipantTranslationKeys.form.fields.registrationStatus,
  remarks: saveParticipantTranslationKeys.form.fields.remarks
}

/**
 * Resolves the i18n key for an import target field label.
 *
 * @param fieldKey - Target field key from the shared import registry.
 * @returns The i18n key, or the raw key when unknown.
 */
export function targetFieldLabelKey(fieldKey: string): string {
  return TARGET_FIELD_TRANSLATION_KEY[fieldKey as ImportTargetFieldKey] ?? fieldKey
}
