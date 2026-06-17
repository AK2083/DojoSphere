import { describe, expect, it } from 'vitest'

import { createMemoryDatabase } from '../../test/database'

import { runInTransaction } from './transactions'

describe('runInTransaction', () => {
  it('commits changes on success', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')

    runInTransaction(db, () => {
      db.prepare('INSERT INTO items (name) VALUES (?)').run('committed')
    })

    const row = db.prepare('SELECT name FROM items WHERE id = 1').get() as { name: string }

    expect(row.name).toBe('committed')
  })

  it('rolls back changes on failure', () => {
    const db = createMemoryDatabase()

    db.exec('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')

    expect(() => {
      runInTransaction(db, () => {
        db.prepare('INSERT INTO items (name) VALUES (?)').run('rolled-back')
        throw new Error('boom')
      })
    }).toThrow('boom')

    const count = db.prepare('SELECT COUNT(*) AS count FROM items').get() as { count: number }

    expect(count.count).toBe(0)
  })
})
