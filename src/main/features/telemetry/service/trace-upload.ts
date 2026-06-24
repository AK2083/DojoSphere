import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { readOtlpExportConfig } from '../config/otlp-env'
import { logWarning, MONITORING_EVENTS } from '../monitoring/monitoring'
import { checkGrafanaCloudReachability } from './grafana-reachability'
import { scrubOtlpJsonLine } from './export-scrubber'
import { getTelemetryUploadPreferences } from './upload-preferences'

const TELEMETRY_DIR_NAME = 'telemetry'
const TRACES_FILE_NAME = 'traces.jsonl'
const UPLOAD_OFFSET_FILE_NAME = 'traces.upload-offset'
const FLUSH_DELAY_MS = 100

let forceFlushMainSpans: (() => Promise<void>) | null = null
let userDataPath: string | null = null

/**
 * Registers the main-process span flush callback used before reading JSONL.
 *
 * @param flush Callback that flushes pending main-process spans.
 */
export function registerMainSpanFlush(flush: () => Promise<void>): void {
  forceFlushMainSpans = flush
}

/**
 * Sets the Electron userData path used for offset and HMAC key files.
 *
 * @param path Absolute userData directory path.
 */
export function setTraceUploadUserDataPath(path: string): void {
  userDataPath = path
}

function resolveUploadOffsetPath(dataPath: string): string {
  return join(dataPath, TELEMETRY_DIR_NAME, UPLOAD_OFFSET_FILE_NAME)
}

async function readUploadOffset(dataPath: string): Promise<number> {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
    const raw = await readFile(resolveUploadOffsetPath(dataPath), 'utf8')
    const parsed = Number.parseInt(raw.trim(), 10)

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  } catch {
    return 0
  }
}

async function writeUploadOffset(dataPath: string, offset: number): Promise<void> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  await writeFile(resolveUploadOffsetPath(dataPath), String(offset), 'utf8')
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function postScrubbedPayload(
  body: string,
  endpoint: string,
  headers: Record<string, string>
) {
  const response = await fetch(`${endpoint}/v1/traces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body
  })

  if (!response.ok) {
    throw new Error(`Grafana OTLP upload failed with status ${response.status}`)
  }
}

/**
 * Uploads newly captured exception traces to Grafana Cloud when preferences allow.
 *
 * @returns Resolves when upload attempt completes (success or no-op).
 */
export async function uploadTracesOnError(): Promise<void> {
  const { autoUploadDiagnostics } = getTelemetryUploadPreferences()

  if (!autoUploadDiagnostics) {
    return
  }

  const config = readOtlpExportConfig()

  if (!config) {
    return
  }

  const reachability = await checkGrafanaCloudReachability()

  if (!reachability.reachable) {
    return
  }

  const traceFilePath = userDataPath
    ? join(userDataPath, TELEMETRY_DIR_NAME, TRACES_FILE_NAME)
    : null
  const dataPath = userDataPath

  if (!traceFilePath || !dataPath) {
    return
  }

  if (forceFlushMainSpans) {
    await forceFlushMainSpans()
  }

  await delay(FLUSH_DELAY_MS)

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted telemetry directory
  const fileContent = await readFile(traceFilePath, 'utf8')
  const offset = await readUploadOffset(dataPath)
  const pendingContent = fileContent.slice(offset)

  if (!pendingContent.trim()) {
    return
  }

  const lines = pendingContent.split('\n').filter((line) => line.trim().length > 0)
  let uploadedBytes = 0

  for (const line of lines) {
    const scrubbed = scrubOtlpJsonLine(line, dataPath)

    if (!scrubbed) {
      uploadedBytes += Buffer.byteLength(line, 'utf8') + 1
      continue
    }

    try {
      await postScrubbedPayload(scrubbed, config.endpoint, config.headers)
      uploadedBytes += Buffer.byteLength(line, 'utf8') + 1
    } catch (error) {
      logWarning(MONITORING_EVENTS.TRACE_UPLOAD_FAILED, {
        reason: error instanceof Error ? error.message : 'unknown'
      })
      break
    }
  }

  if (uploadedBytes > 0) {
    await writeUploadOffset(dataPath, offset + uploadedBytes)
  }
}
