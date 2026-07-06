import { describe, expect, it } from 'vitest'

import { DUPLICATE_COMPETITOR_ERROR } from './competitor-duplicate'
import { importRowFailureCode } from './competitor-import-row-error'

describe('competitor-import-row-error', () => {
  it('maps duplicate and generic import failures to row error codes', () => {
    expect(importRowFailureCode(new Error(DUPLICATE_COMPETITOR_ERROR))).toBe(
      DUPLICATE_COMPETITOR_ERROR
    )
    expect(importRowFailureCode(new Error('Given name must not be empty'))).toBe('import_failed')
    expect(importRowFailureCode('plain failure')).toBe('import_failed')
    expect(importRowFailureCode(DUPLICATE_COMPETITOR_ERROR)).toBe(DUPLICATE_COMPETITOR_ERROR)
  })
})
