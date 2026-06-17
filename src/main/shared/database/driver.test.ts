import { describe, expect, it } from 'vitest'

import { createSqliteDatabase } from './driver'

describe('createSqliteDatabase', () => {
  it('opens an in-memory database', () => {
    const db = createSqliteDatabase(':memory:')

    const result = db.prepare('SELECT 1 AS value').get() as { value: number }

    expect(result.value).toBe(1)
    db.close()
  })
})
