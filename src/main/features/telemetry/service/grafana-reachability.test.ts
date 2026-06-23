import { describe, expect, it, vi } from 'vitest'

import { checkGrafanaCloudReachability, isGrafanaReachabilityStatus } from './grafana-reachability'

describe('grafana-reachability', () => {
  it('treats sub-500 responses as reachable', () => {
    expect(isGrafanaReachabilityStatus(200)).toBe(true)
    expect(isGrafanaReachabilityStatus(401)).toBe(true)
    expect(isGrafanaReachabilityStatus(405)).toBe(true)
    expect(isGrafanaReachabilityStatus(500)).toBe(false)
    expect(isGrafanaReachabilityStatus(0)).toBe(false)
  })

  it('returns not_configured when OTLP endpoint env vars are missing', async () => {
    await expect(checkGrafanaCloudReachability({ env: {} })).resolves.toEqual({
      reachable: false,
      reason: 'not_configured'
    })
  })

  it('returns reachable when HEAD succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 405 })

    await expect(
      checkGrafanaCloudReachability({
        env: { OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com' },
        fetchImpl
      })
    ).resolves.toEqual({ reachable: true })

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://otlp.example.com/v1/traces',
      expect.objectContaining({
        method: 'HEAD',
        headers: {}
      })
    )
  })

  it('returns request_failed when HEAD throws or returns server errors', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'))

    await expect(
      checkGrafanaCloudReachability({
        env: { OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com' },
        fetchImpl
      })
    ).resolves.toEqual({ reachable: false, reason: 'request_failed' })

    fetchImpl.mockResolvedValue({ status: 503 })

    await expect(
      checkGrafanaCloudReachability({
        env: { OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com' },
        fetchImpl
      })
    ).resolves.toEqual({ reachable: false, reason: 'request_failed' })
  })

  it('sends configured OTLP headers with the reachability probe', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 200 })

    await checkGrafanaCloudReachability({
      env: {
        OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com',
        OTEL_EXPORTER_OTLP_HEADERS: 'Authorization=Basic token'
      },
      fetchImpl
    })

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://otlp.example.com/v1/traces',
      expect.objectContaining({
        headers: { Authorization: 'Basic token' }
      })
    )
  })

  it('uses the global fetch implementation by default', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 204 })
    vi.stubGlobal('fetch', fetchImpl)

    await expect(
      checkGrafanaCloudReachability({
        env: { OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com' }
      })
    ).resolves.toEqual({ reachable: true })

    expect(fetchImpl).toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
