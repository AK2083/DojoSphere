import { type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  startLocalCollector,
  stopLocalCollector,
  type LocalCollectorHandle
} from './local-collector'

type HttpRequestListener = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => void

describe('local-collector', () => {
  let handle: LocalCollectorHandle | null = null
  let tempDir = ''

  afterEach(async () => {
    if (handle) {
      await stopLocalCollector(handle)
      handle = null
    }
  })

  it('accepts OTLP trace batches and writes them to traces.jsonl', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14318 })

    const payload = JSON.stringify({ resourceSpans: [{ scopeSpans: [] }] })
    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload
    })

    expect(response.status).toBe(200)

    const traceFilePath = join(tempDir, 'telemetry', 'traces.jsonl')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    const fileContents = await readFile(traceFilePath, 'utf8')
    expect(fileContents.trim()).toBe(payload)
  })

  it('responds to CORS preflight from the Vite dev server origin', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14319 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
    expect(response.headers.get('access-control-allow-methods')).toContain('POST')
  })

  it('allows CORS from 127.0.0.1 dev server origin', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14320 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://127.0.0.1:5173' }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('http://127.0.0.1:5173')
  })

  it('returns 404 for non-trace paths', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14321 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/metrics`, {
      method: 'POST',
      body: '{}'
    })

    expect(response.status).toBe(404)
  })

  it('uses default host and port when omitted', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir })

    expect(handle.host).toBe('127.0.0.1')
    expect(handle.port).toBe(4318)

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'POST',
      body: '{}'
    })

    expect(response.status).toBe(200)
  })

  it('returns 405 for unsupported methods on the trace endpoint', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14322 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'GET'
    })

    expect(response.status).toBe(405)
  })

  it('accepts empty POST bodies without writing to disk', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14323 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' }
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-headers')).toBe('content-type')

    const traceFilePath = join(tempDir, 'telemetry', 'traces.jsonl')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await expect(readFile(traceFilePath, 'utf8')).rejects.toThrow()
  })

  it('rejects disallowed CORS origins', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14324 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil.example' }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('ignores malformed origin headers', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
    handle = await startLocalCollector({ userDataPath: tempDir, port: 14328 })

    const response = await fetch(`http://127.0.0.1:${handle.port}/v1/traces`, {
      method: 'OPTIONS',
      headers: { Origin: 'not-a-valid-url' }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('rejects stopLocalCollector when the server close callback fails', async () => {
    const fakeServer = {
      close(callback: (error?: Error | null) => void) {
        callback(new Error('close failed'))
      }
    } as unknown as Server

    await expect(
      stopLocalCollector({
        server: fakeServer,
        traceFilePath: '/tmp/traces.jsonl',
        host: '127.0.0.1',
        port: 1
      })
    ).rejects.toThrow('close failed')
  })

  describe('server startup errors', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('rejects when the HTTP server fails to listen', async () => {
      vi.doMock('node:http', async (importOriginal) => {
        const original = await importOriginal<typeof import('node:http')>()

        return {
          ...original,
          createServer: (...args: Parameters<typeof original.createServer>) => {
            const server = original.createServer(...args)

            server.listen = vi.fn((...args: unknown[]) => {
              server.emit('error', new Error('address in use'))
              const callback = args.find((arg): arg is () => void => typeof arg === 'function')
              callback?.()
              return server
            }) as typeof server.listen

            return server
          }
        }
      })

      const { startLocalCollector: startWithMockedHttp } = await import('./local-collector')

      await expect(
        startWithMockedHttp({ userDataPath: tempDir || '/tmp', port: 14326 })
      ).rejects.toThrow('address in use')
    })
  })

  describe('request errors', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('returns 500 when the incoming request emits an error', async () => {
      let requestHandler: HttpRequestListener | undefined

      vi.doMock('node:http', async (importOriginal) => {
        const original = await importOriginal<typeof import('node:http')>()

        return {
          ...original,
          createServer: (handler: HttpRequestListener) => {
            requestHandler = handler
            return original.createServer(handler)
          }
        }
      })

      tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
      const { startLocalCollector: startWithSpy } = await import('./local-collector')
      handle = await startWithSpy({ userDataPath: tempDir, port: 14327 })

      expect(requestHandler).toBeDefined()

      const responsePromise = new Promise<number>((resolve) => {
        const res = {
          writeHead(status: number) {
            resolve(status)
          },
          end: vi.fn(),
          setHeader: vi.fn()
        }

        const req = {
          method: 'POST',
          url: '/v1/traces',
          headers: {},
          on(event: string, listener: (...args: unknown[]) => void) {
            if (event === 'error') {
              queueMicrotask(() => listener(new Error('request aborted')))
            }
          }
        }

        requestHandler?.(req as IncomingMessage, res as unknown as ServerResponse<IncomingMessage>)
      })

      expect(await responsePromise).toBe(500)
    })

    it('returns 404 when the request URL is missing', async () => {
      let requestHandler: HttpRequestListener | undefined

      vi.doMock('node:http', async (importOriginal) => {
        const original = await importOriginal<typeof import('node:http')>()

        return {
          ...original,
          createServer: (handler: HttpRequestListener) => {
            requestHandler = handler
            return original.createServer(handler)
          }
        }
      })

      tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-telemetry-'))
      const { startLocalCollector: startWithSpy } = await import('./local-collector')
      handle = await startWithSpy({ userDataPath: tempDir, port: 14329 })

      const statusPromise = new Promise<number>((resolve) => {
        const res = {
          writeHead(status: number) {
            resolve(status)
          },
          end: vi.fn(),
          setHeader: vi.fn()
        }

        requestHandler?.(
          {
            method: 'POST',
            headers: {}
          } as IncomingMessage,
          res as unknown as ServerResponse<IncomingMessage>
        )
      })

      expect(await statusPromise).toBe(404)
    })
  })
})
