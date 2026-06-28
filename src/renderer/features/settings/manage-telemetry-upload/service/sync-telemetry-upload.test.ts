import { beforeEach, describe, expect, it, vi } from 'vitest'

import { syncTelemetryUploadPreferencesToMain } from './sync-telemetry-upload'

describe('sync-telemetry-upload', () => {
  beforeEach(() => {
    globalThis.window.api = {
      setDiagnosticsUploadPreferences: vi.fn().mockResolvedValue(undefined)
    } as never
  })

  it('syncs upload preferences to main', async () => {
    await syncTelemetryUploadPreferencesToMain({ autoUploadDiagnostics: true })

    expect(globalThis.window.api.setDiagnosticsUploadPreferences).toHaveBeenCalledWith({
      autoUploadDiagnostics: true
    })
  })

  it('no-ops when electron api is unavailable', async () => {
    globalThis.window.api = undefined as never

    await syncTelemetryUploadPreferencesToMain({ autoUploadDiagnostics: true })
  })
})
