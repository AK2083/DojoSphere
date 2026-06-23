import { describe, expect, it, vi } from 'vitest'

describe('checkGrafanaCloudReachability', () => {
  it('returns not_configured when Electron IPC is unavailable', async () => {
    vi.stubGlobal('window', undefined)

    const { checkGrafanaCloudReachability } = await import('./check-grafana-cloud-reachability')

    await expect(checkGrafanaCloudReachability()).resolves.toEqual({
      reachable: false,
      reason: 'not_configured'
    })

    vi.unstubAllGlobals()
  })

  it('delegates to window.api when available', async () => {
    const invoke = vi.fn().mockResolvedValue({ reachable: true })
    vi.stubGlobal('window', { api: { checkGrafanaCloudReachability: invoke } })

    const { checkGrafanaCloudReachability } = await import('./check-grafana-cloud-reachability')

    await expect(checkGrafanaCloudReachability()).resolves.toEqual({ reachable: true })
    expect(invoke).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })
})
