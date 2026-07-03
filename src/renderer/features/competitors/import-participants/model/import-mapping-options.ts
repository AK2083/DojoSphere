import saveParticipantTranslationKeys from '../../save-participant/i18n/keys'
import translationKeys from '../i18n/keys'

export /**
 *
 */
const SOURCE_COLUMN_KEYS = ['givenName', 'familyName', 'club'] as const
/**
 *
 */
export type SourceColumnKey = (typeof SOURCE_COLUMN_KEYS)[number]

export /**
 *
 */
const TARGET_FIELD_KEYS = [
  'givenName',
  'familyName',
  'gender',
  'birthDate',
  'club',
  'nationality',
  'weightClass',
  'ageClass',
  'passNumber',
  'gradingSystem',
  'grade',
  'licenseNumber',
  'contactPhone',
  'coach'
] as const

/**
 *
 */
export type TargetFieldKey = (typeof TARGET_FIELD_KEYS)[number]

export /**
 *
 */
const SOURCE_COLUMN_TRANSLATION_KEY: Record<SourceColumnKey, string> = {
  givenName: translationKeys.mapping.sourceColumns.givenName,
  familyName: translationKeys.mapping.sourceColumns.familyName,
  club: translationKeys.mapping.sourceColumns.club
}

export /**
 *
 */
const TARGET_FIELD_TRANSLATION_KEY: Record<TargetFieldKey, string> = {
  givenName: saveParticipantTranslationKeys.form.fields.givenName,
  familyName: saveParticipantTranslationKeys.form.fields.familyName,
  gender: saveParticipantTranslationKeys.form.fields.gender,
  birthDate: saveParticipantTranslationKeys.form.fields.birthDate,
  club: saveParticipantTranslationKeys.form.fields.club,
  nationality: saveParticipantTranslationKeys.form.fields.nationality,
  weightClass: saveParticipantTranslationKeys.form.fields.weightClass,
  ageClass: saveParticipantTranslationKeys.form.fields.ageClass,
  passNumber: saveParticipantTranslationKeys.form.fields.passNumber,
  gradingSystem: saveParticipantTranslationKeys.form.fields.gradingSystem,
  grade: saveParticipantTranslationKeys.form.fields.grade,
  licenseNumber: saveParticipantTranslationKeys.form.fields.licenseNumber,
  contactPhone: saveParticipantTranslationKeys.form.fields.contactPhone,
  coach: saveParticipantTranslationKeys.form.fields.coach
}
