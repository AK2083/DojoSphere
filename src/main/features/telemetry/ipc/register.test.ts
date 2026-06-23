import { describe, expect, it, vi } from 'vitest'

import { getIpcHandler } from '../../../test/electron-mock'

vi.mock('../service/grafana-reachability', () => ({
  checkGrafanaCloudReachability: vi.fn()
}))

describe('registerTelemetryIpc', () => {
  it('returns Grafana reachability from the IPC handler', async () => {
    const { checkGrafanaCloudReachability } = await import('../service/grafana-reachability')
    vi.mocked(checkGrafanaCloudReachability).mockResolvedValue({ reachable: true })

    const { registerTelemetryIpc } = await import('./register')
    registerTelemetryIpc()

    await expect(getIpcHandler('telemetry:checkGrafanaReachability')()).resolves.toEqual({
      reachable: true
    })
  })
})
