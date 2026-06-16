import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../../test/database'

import { applyPragmas } from './pragmas'

describe('applyPragmas', () => {
  it('enables foreign keys', () => {
    const db = createMemoryDatabase()

    applyPragmas(db)

    const foreignKeys = db.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number }

    expect(foreignKeys.foreign_keys).toBe(1)
  })
})
