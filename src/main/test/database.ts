import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { vi } from 'vitest'

import type { SqliteDatabase } from '../database/types/database'
import { app } from './electron-mock'

let testUserDataDir: string | undefined

export function createMemoryDatabase(): SqliteDatabase {
  try {
    const BetterSqlite3 = require('better-sqlite3') as typeof import('better-sqlite3')
    return new BetterSqlite3(':memory:')
  } catch {
    const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite')
    return new DatabaseSync(':memory:')
  }
}

export function createTestUserDataDir() {
  testUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dojosphere-test-'))
  app.getPath.mockReturnValue(testUserDataDir)

  return testUserDataDir
}

export async function initTestDatabase() {
  vi.resetModules()
  createTestUserDataDir()

  const { initDatabase } = await import('../database/connection')
  const { runMigrations } = await import('../database/migrate')

  const db = initDatabase()
  runMigrations(db)

  return db
}

export async function closeTestDatabase() {
  const { closeDatabase } = await import('../database/connection')
  closeDatabase()

  if (testUserDataDir) {
    fs.rmSync(testUserDataDir, { recursive: true, force: true })
    testUserDataDir = undefined
  }
}
