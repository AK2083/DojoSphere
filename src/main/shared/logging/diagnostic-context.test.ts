import { mkdtemp, readFile } from 'node:fs/promises'
import { release, tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildSystemSnapshot,
  captureSystemSnapshot,
  type SystemSnapshot
} from './diagnostic-context'
import { initLogger, resetLogger } from './logger'

const EXPECTED_SNAPSHOT_KEYS: (keyof SystemSnapshot)[] = [
  'platform',
  'arch',
  'osRelease',
  'appVersion',
  'electronVersion',
  'mode'
]

describe('diagnostic-context', () => {
  let tempDir = ''

  beforeEach(async () => {
    resetLogger()
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-logs-'))
    initLogger(tempDir)
  })

  afterEach(() => {
    resetLogger()
    vi.restoreAllMocks()
  })

  it('buildSystemSnapshot returns only allowlisted fields', () => {
    const snapshot = buildSystemSnapshot()

    expect(Object.keys(snapshot).sort()).toEqual([...EXPECTED_SNAPSHOT_KEYS].sort())
    expect(snapshot.platform).toBe(process.platform)
    expect(snapshot.arch).toBe(process.arch)
    expect(snapshot.osRelease).toBe(release())
    expect(snapshot.appVersion).toBe('1.0.0-test')
    expect(snapshot.electronVersion).toBe(process.versions.electron ?? 'unknown')
    expect(snapshot.mode).toBe(import.meta.env.MODE)
  })

  it('captureSystemSnapshot writes a diagnostics session_snapshot info line', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined)

    captureSystemSnapshot()

    await new Promise((resolve) => setTimeout(resolve, 10))

    const logFile = join(tempDir, 'logs', 'app.log')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    const contents = await readFile(logFile, 'utf8')

    expect(contents).toContain('[info] [diagnostics] session_snapshot')
    expect(contents).toContain(`platform=${process.platform}`)
    expect(contents).toContain(`arch=${process.arch}`)
    expect(contents).toContain(`osRelease=${release()}`)
    expect(contents).toContain('appVersion=1.0.0-test')
    expect(contents).toContain(`electronVersion=${process.versions.electron ?? 'unknown'}`)
    expect(contents).toContain(`mode=${import.meta.env.MODE}`)
  })

  it('uses unknown when electron version is missing', () => {
    const originalElectronVersion = process.versions.electron

    Object.defineProperty(process.versions, 'electron', {
      configurable: true,
      value: undefined
    })

    expect(buildSystemSnapshot().electronVersion).toBe('unknown')

    Object.defineProperty(process.versions, 'electron', {
      configurable: true,
      value: originalElectronVersion
    })
  })
})
