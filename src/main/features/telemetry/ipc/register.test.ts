import { describe, expect, it, vi } from 'vitest'

import { getIpcHandler } from '../../../test/electron-mock'

vi.mock('../service/grafana-reachability', () => ({
  checkGrafanaCloudReachability: vi.fn()
}))

vi.mock('../service/upload-preferences', () => ({
  setTelemetryUploadPreferences: vi.fn()
}))

vi.mock('../service/trace-upload', () => ({
  uploadTracesOnError: vi.fn()
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

  it('syncs upload preferences through IPC', async () => {
    const { setTelemetryUploadPreferences } = await import('../service/upload-preferences')
    const { registerTelemetryIpc } = await import('./register')
    registerTelemetryIpc()

    await getIpcHandler('telemetry:setUploadPreferences')(null, { autoUploadDiagnostics: true })

    expect(setTelemetryUploadPreferences).toHaveBeenCalledWith({ autoUploadDiagnostics: true })
  })

  it('triggers upload on error through IPC', async () => {
    const { uploadTracesOnError } = await import('../service/trace-upload')
    const { registerTelemetryIpc } = await import('./register')
    registerTelemetryIpc()

    await getIpcHandler('telemetry:uploadOnError')()

    expect(uploadTracesOnError).toHaveBeenCalledOnce()
  })
})
