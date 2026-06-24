import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { hashTelemetryUserId, resolveTelemetryExportHmacSecret } from './telemetry-user-id-hmac'

describe('telemetry-user-id-hmac', () => {
  let tempDir = ''

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true })
      tempDir = ''
    }
  })

  it('returns stable HMAC for the same user id and secret', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-hmac-'))
    const secret = resolveTelemetryExportHmacSecret(tempDir)

    const first = hashTelemetryUserId('user-1', secret)
    const second = hashTelemetryUserId('user-1', secret)

    expect(first).toBe(second)
    expect(first).not.toBe('user-1')
  })

  it('uses env secret when provided', () => {
    const secret = resolveTelemetryExportHmacSecret('/unused', {
      TELEMETRY_EXPORT_HMAC_SECRET: 'test-secret'
    })

    expect(hashTelemetryUserId('user-1', secret)).toMatch(/^[a-f0-9]{64}$/)
  })

  it('uses existing install secret file when present', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'dojosphere-hmac-existing-'))
    const telemetryDir = join(tempDir, 'telemetry')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    mkdirSync(telemetryDir, { recursive: true })
    const secret = Buffer.from('existing-secret')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    writeFileSync(join(telemetryDir, 'export-hmac.key'), secret)

    const resolved = resolveTelemetryExportHmacSecret(tempDir)
    const digest = hashTelemetryUserId('user-1', resolved)

    expect(digest).toBe(hashTelemetryUserId('user-1', secret))
  })
})
