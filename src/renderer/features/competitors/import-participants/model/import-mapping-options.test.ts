import {
  COMPETITOR_IMPORT_FIELDS,
  isParticipantFormRequiredImportField,
  PARTICIPANT_FORM_REQUIRED_IMPORT_FIELD_KEYS
} from '@shared/domain/competitor-import-fields'
import { describe, expect, it } from 'vitest'

import { TARGET_FIELD_TRANSLATION_KEY, targetFieldLabelKey } from './import-mapping-options'

describe('import-mapping-options', () => {
  it('provides a translation key for every import target field', () => {
    for (const field of COMPETITOR_IMPORT_FIELDS) {
      expect(TARGET_FIELD_TRANSLATION_KEY[field.key]).toBeTruthy()
    }
  })

  it('maps form fields to the save-participant translation keys', () => {
    expect(TARGET_FIELD_TRANSLATION_KEY.givenName).toBe(
      'competitors.saveParticipant.form.fields.givenName'
    )
    expect(TARGET_FIELD_TRANSLATION_KEY.contactPerson).toBe(
      'competitors.saveParticipant.form.fields.contactPerson'
    )
    expect(TARGET_FIELD_TRANSLATION_KEY.remarks).toBe(
      'competitors.saveParticipant.form.fields.remarks'
    )
  })

  it('uses the import-specific key for the raw weight field', () => {
    expect(TARGET_FIELD_TRANSLATION_KEY.weightKg).toBe(
      'competitors.importParticipants.mapping.targetFields.weightKg'
    )
  })

  it('resolves a label key and falls back to the raw key when unknown', () => {
    expect(targetFieldLabelKey('givenName')).toBe(
      'competitors.saveParticipant.form.fields.givenName'
    )
    expect(targetFieldLabelKey('unknownField')).toBe('unknownField')
  })

  it('marks the same fields as required as the participant form', () => {
    expect(PARTICIPANT_FORM_REQUIRED_IMPORT_FIELD_KEYS).toEqual([
      'givenName',
      'familyName',
      'gender',
      'birthDate',
      'club',
      'nationality',
      'passNumber'
    ])
    expect(isParticipantFormRequiredImportField('grade')).toBe(false)
    expect(isParticipantFormRequiredImportField('contactPerson')).toBe(false)
  })
})
