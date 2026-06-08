import { describe, expect, it, vi } from 'vitest'

import { createMemoryDatabase } from '../test/database'
import { applyPragmas } from './pragmas'
import { runInTransaction } from './transactions'
import type { SqliteDatabase } from './types/database'

describe('applyPragmas', () => {
  it('uses the pragma API when the driver supports it', () => {
    const pragma = vi.fn()
    const exec = vi.fn()
    const db = { pragma, exec } as unknown as SqliteDatabase

    applyPragmas(db)

    expect(pragma).toHaveBeenCalledWith('journal_mode = WAL')
    expect(pragma).toHaveBeenCalledWith('foreign_keys = ON')
    expect(pragma).toHaveBeenCalledWith('busy_timeout = 5000')
    expect(exec).not.toHaveBeenCalled()
  })

  it('enables foreign keys via exec when pragma is unavailable', () => {
    const db = createMemoryDatabase()

    applyPragmas(db)

    const foreignKeys = db.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number }

    expect(foreignKeys.foreign_keys).toBe(1)
  })
})

describe('runInTransaction', () => {
  it('uses native transaction when the driver supports it', () => {
    const callback = vi.fn()
    const transaction = vi.fn((fn: () => void) => () => fn())
    const exec = vi.fn()
    const db = { transaction, exec } as unknown as SqliteDatabase

    runInTransaction(db, callback)

    expect(transaction).toHaveBeenCalledWith(callback)
    expect(callback).toHaveBeenCalled()
    expect(exec).not.toHaveBeenCalled()
  })

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
