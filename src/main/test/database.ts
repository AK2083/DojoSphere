import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { vi } from 'vitest'

import { app } from './electron-mock'

let testUserDataDir: string | undefined

export { createMemoryDatabase } from '@main/shared/database'

export function createTestUserDataDir() {
  testUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dojosphere-test-'))
  app.getPath.mockReturnValue(testUserDataDir)

  return testUserDataDir
}

export async function initTestDatabase() {
  vi.resetModules()
  createTestUserDataDir()

  const { initDatabase, runMigrations } = await import('@main/shared/database')

  const db = initDatabase()
  runMigrations(db)

  return db
}

export async function closeTestDatabase() {
  const { closeDatabase } = await import('@main/shared/database')
  closeDatabase()

  if (testUserDataDir) {
    fs.rmSync(testUserDataDir, { recursive: true, force: true })
    testUserDataDir = undefined
  }
}
