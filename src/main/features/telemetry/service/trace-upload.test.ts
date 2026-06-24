import { appendFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const checkGrafanaCloudReachability = vi.fn()
const readOtlpExportConfig = vi.fn()

vi.mock('./grafana-reachability', () => ({
  checkGrafanaCloudReachability
}))

vi.mock('../config/otlp-env', () => ({
  readOtlpExportConfig
}))

vi.mock('../monitoring/monitoring', () => ({
  logWarning: vi.fn(),
  MONITORING_EVENTS: { TRACE_UPLOAD_FAILED: 'telemetry.trace_upload.failed' }
}))

describe('trace-upload', () => {
  let tempDir = ''
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    checkGrafanaCloudReachability.mockResolvedValue({ reachable: true })
    readOtlpExportConfig.mockReturnValue({
      endpoint: 'https://otlp.example.com/otlp',
      headers: { Authorization: 'Basic test' }
    })
  })

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
      tempDir = ''
    }
    vi.unstubAllGlobals()
  })

  async function writeTraceLine(line: string) {
    const telemetryDir = join(tempDir, 'telemetry')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await mkdir(telemetryDir, { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await appendFile(join(telemetryDir, 'traces.jsonl'), `${line}\n`, { flag: 'a' })
  }

  it('uploads scrubbed exception traces when preferences and config allow', async () => {
    let flushed = false
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    const telemetryDir = join(tempDir, 'telemetry')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await mkdir(telemetryDir, { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await writeFile(join(telemetryDir, 'traces.upload-offset'), '0', 'utf8')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await appendFile(
      join(telemetryDir, 'traces.jsonl'),
      `${JSON.stringify({
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: [
                  {
                    name: 'exception',
                    attributes: [
                      { key: 'service.name', value: { stringValue: 'auth' } },
                      { key: 'action', value: { stringValue: 'login' } },
                      { key: 'error.code', value: { stringValue: 'auth.invalid_credentials' } }
                    ],
                    status: { code: 2, message: 'raw' }
                  }
                ]
              }
            ]
          }
        ]
      })}\n`
    )

    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: true })
    traceUpload.setTraceUploadUserDataPath(tempDir)
    traceUpload.registerMainSpanFlush(async () => {
      flushed = true
    })

    await traceUpload.uploadTracesOnError()

    expect(flushed).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))
    expect(body.resourceSpans[0].scopeSpans[0].spans[0].attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'error.code' }),
        expect.objectContaining({ key: 'service.name' })
      ])
    )
  })

  it('advances offset for non-uploadable lines', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    await writeTraceLine('{"resourceSpans":[{"scopeSpans":[{"spans":[{"name":"breadcrumb"}]}]}]}')

    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: true })
    traceUpload.setTraceUploadUserDataPath(tempDir)

    await traceUpload.uploadTracesOnError()

    expect(fetchMock).not.toHaveBeenCalled()
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    const offset = await readFile(join(tempDir, 'telemetry', 'traces.upload-offset'), 'utf8')
    expect(Number(offset)).toBeGreaterThan(0)
  })

  it('skips upload when auto diagnostics is disabled', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: false })
    traceUpload.setTraceUploadUserDataPath(tempDir)

    await traceUpload.uploadTracesOnError()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('skips upload when grafana is unreachable or config is missing', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: true })
    traceUpload.setTraceUploadUserDataPath(tempDir)
    readOtlpExportConfig.mockReturnValue(null)

    await traceUpload.uploadTracesOnError()
    expect(fetchMock).not.toHaveBeenCalled()

    readOtlpExportConfig.mockReturnValue({
      endpoint: 'https://otlp.example.com/otlp',
      headers: {}
    })
    checkGrafanaCloudReachability.mockResolvedValue({ reachable: false, reason: 'request_failed' })

    await traceUpload.uploadTracesOnError()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('logs and stops when grafana upload fails', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    const telemetryDir = join(tempDir, 'telemetry')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await mkdir(telemetryDir, { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await appendFile(
      join(telemetryDir, 'traces.jsonl'),
      `${JSON.stringify({
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: [
                  {
                    name: 'exception',
                    attributes: [
                      { key: 'error.code', value: { stringValue: 'shared.error.unknown' } }
                    ],
                    status: { code: 2 }
                  }
                ]
              }
            ]
          }
        ]
      })}\n`
    )

    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })
    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')
    const { logWarning } = await import('../monitoring/monitoring')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: true })
    traceUpload.setTraceUploadUserDataPath(tempDir)

    await traceUpload.uploadTracesOnError()
    expect(logWarning).toHaveBeenCalled()
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    const offset = await readFile(join(tempDir, 'telemetry', 'traces.upload-offset'), 'utf8').catch(
      () => '0'
    )
    expect(Number(offset)).toBe(0)

    fetchMock.mockRejectedValueOnce('network down')
    await traceUpload.uploadTracesOnError()
    expect(logWarning).toHaveBeenCalledTimes(2)
  })

  it('returns early when user data path is unset or pending content is empty', async () => {
    const traceUpload = await import('./trace-upload')
    const uploadPreferences = await import('./upload-preferences')

    uploadPreferences.setTelemetryUploadPreferences({ autoUploadDiagnostics: true })

    await traceUpload.uploadTracesOnError()
    expect(fetchMock).not.toHaveBeenCalled()

    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-upload-'))
    const telemetryDir = join(tempDir, 'telemetry')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await mkdir(telemetryDir, { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await writeFile(join(telemetryDir, 'traces.upload-offset'), '-5', 'utf8')
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
    await appendFile(join(telemetryDir, 'traces.jsonl'), '', 'utf8')

    traceUpload.setTraceUploadUserDataPath(tempDir)
    await traceUpload.uploadTracesOnError()

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
