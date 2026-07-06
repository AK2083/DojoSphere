import { describe, expect, it } from 'vitest'

import { IMPORT_RESULT_FIXTURES } from './import-result-fixtures'

describe('import-result-fixtures', () => {
  it('provides fictional result rows with success flags', () => {
    expect(IMPORT_RESULT_FIXTURES).toHaveLength(5)
    expect(IMPORT_RESULT_FIXTURES.some((participant) => participant.success)).toBe(true)
    expect(IMPORT_RESULT_FIXTURES.some((participant) => !participant.success)).toBe(true)
  })

  it('assigns a unique index to each row', () => {
    const indexes = IMPORT_RESULT_FIXTURES.map((participant) => participant.index)

    expect(new Set(indexes).size).toBe(IMPORT_RESULT_FIXTURES.length)
  })
})
