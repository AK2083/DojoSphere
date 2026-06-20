import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>()

  return {
    ...original,
    appendFile: vi.fn(async () => {
      throw new Error('disk full')
    })
  }
})

import {
  startLocalCollector,
  stopLocalCollector,
  type LocalCollectorHandle
} from './local-collector'

describe('local-collector persistence failures', () => {
  let handle: LocalCollectorHandle | null = null

  afterEach(async () => {
    if (handle) {
      await stopLocalCollector(handle)
      handle = null
    }
  })

  it('returns 500 when persisting a trace batch fails', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14325 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"resourceSpans":[]}'
    })

    expect(response.status).toBe(500)
  })
})
