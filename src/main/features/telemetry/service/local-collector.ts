import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { mkdirSync } from 'node:fs'
import { appendFile } from 'node:fs/promises'
import { join } from 'node:path'

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 4318
const TELEMETRY_DIR_NAME = 'telemetry'
const TRACES_FILE_NAME = 'traces.jsonl'

/** Options for starting the local OTLP/HTTP trace collector. */
export type LocalCollectorOptions = {
  userDataPath: string
  host?: string
  port?: number
}

/** Handle for a running local OTLP/HTTP trace collector. */
export type LocalCollectorHandle = {
  server: Server
  traceFilePath: string
  host: string
  port: number
}

function isTraceEndpoint(url: string | undefined): boolean {
  return url?.startsWith('/v1/traces') ?? false
}

function resolveAllowedOrigin(origin: string | undefined): string | undefined {
  if (!origin) {
    return undefined
  }

  let parsed: URL

  try {
    parsed = new URL(origin)
  } catch {
    return undefined
  }

  const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
  const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:'

  return isLoopback && isHttp ? origin : undefined
}

function writeCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = resolveAllowedOrigin(req.headers.origin)

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  const requestedHeaders = req.headers['access-control-request-headers']

  if (requestedHeaders) {
    res.setHeader('Access-Control-Allow-Headers', requestedHeaders)
  } else {
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
  }
}

function handleOptions(req: IncomingMessage, res: ServerResponse) {
  writeCorsHeaders(req, res)
  res.writeHead(204)
  res.end()
}

function resolveTelemetryPaths(userDataPath: string): {
  telemetryDir: string
  traceFilePath: string
} {
  const telemetryDir = join(userDataPath, TELEMETRY_DIR_NAME)
  const traceFilePath = join(telemetryDir, TRACES_FILE_NAME)

  return { telemetryDir, traceFilePath }
}

/**
 * Appends an OTLP trace payload as one JSONL line.
 *
 * @param traceFilePath Absolute path to the JSONL trace file.
 * @param body Raw OTLP payload bytes.
 */
async function appendTraceLine(traceFilePath: string, body: Buffer): Promise<void> {
  // Path is resolved under Electron userData; not derived from untrusted input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  await appendFile(traceFilePath, Buffer.concat([body, Buffer.from('\n')]))
}

/**
 * Starts a local OTLP/HTTP collector that writes trace payloads to disk and logs them for debugging.
 *
 * @param options Collector directory and listen options.
 * @returns Running HTTP server handle and trace file path.
 */
export function startLocalCollector(options: LocalCollectorOptions): Promise<LocalCollectorHandle> {
  const host = options.host ?? DEFAULT_HOST
  const port = options.port ?? DEFAULT_PORT
  const { telemetryDir, traceFilePath } = resolveTelemetryPaths(options.userDataPath)

  // Path is resolved under Electron userData; not derived from untrusted input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  mkdirSync(telemetryDir, { recursive: true })

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      if (!isTraceEndpoint(req.url)) {
        res.writeHead(404)
        res.end()
        return
      }

      if (req.method === 'OPTIONS') {
        handleOptions(req, res)
        return
      }

      if (req.method !== 'POST') {
        res.writeHead(405)
        res.end()
        return
      }

      const chunks: Buffer[] = []

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      req.on('end', () => {
        void (async () => {
          const body = Buffer.concat(chunks)

          if (body.length > 0) {
            console.info('[telemetry:collector] received OTLP trace batch')
            await appendTraceLine(traceFilePath, body)
          }

          writeCorsHeaders(req, res)
          res.writeHead(200)
          res.end()
        })().catch((error: unknown) => {
          console.error('[telemetry:collector] failed to persist trace batch:', error)
          writeCorsHeaders(req, res)
          res.writeHead(500)
          res.end()
        })
      })

      req.on('error', (error) => {
        console.error('[telemetry:collector] request error:', error)
        writeCorsHeaders(req, res)
        res.writeHead(500)
        res.end()
      })
    })

    server.on('error', reject)

    server.listen(port, host, () => {
      const address = server.address()
      const boundPort = typeof address === 'object' && address !== null ? address.port : port

      console.info(`[telemetry:collector] listening on http://${host}:${boundPort}`)
      resolve({ server, traceFilePath, host, port: boundPort })
    })
  })
}

/**
 * Stops the local OTLP collector HTTP server.
 *
 * @param handle Collector handle returned by {@link startLocalCollector}.
 * @returns Resolves when the HTTP server has closed.
 */
export function stopLocalCollector(handle: LocalCollectorHandle): Promise<void> {
  return new Promise((resolve, reject) => {
    handle.server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
