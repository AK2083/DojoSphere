import { describe, expect, it } from 'vitest'

import {
  SOURCE_COLUMN_KEYS,
  SOURCE_COLUMN_TRANSLATION_KEY,
  TARGET_FIELD_KEYS,
  TARGET_FIELD_TRANSLATION_KEY
} from './import-mapping-options'

describe('import-mapping-options', () => {
  it('defines source column keys and translation paths', () => {
    expect(SOURCE_COLUMN_KEYS).toEqual(['givenName', 'familyName', 'club'])
    expect(SOURCE_COLUMN_TRANSLATION_KEY.givenName).toBe(
      'competitors.importParticipants.mapping.sourceColumns.givenName'
    )
  })

  it('defines all participant form field keys and translation paths', () => {
    expect(TARGET_FIELD_KEYS).toHaveLength(14)
    expect(TARGET_FIELD_TRANSLATION_KEY.givenName).toBe(
      'competitors.saveParticipant.form.fields.givenName'
    )
    expect(TARGET_FIELD_TRANSLATION_KEY.passNumber).toBe(
      'competitors.saveParticipant.form.fields.passNumber'
    )
    expect(TARGET_FIELD_TRANSLATION_KEY.coach).toBe('competitors.saveParticipant.form.fields.coach')
  })
})
