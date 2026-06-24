import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  requestTelemetryUploadOnError,
  syncTelemetryUploadPreferencesToMain
} from './sync-telemetry-upload'

describe('sync-telemetry-upload', () => {
  beforeEach(() => {
    globalThis.window.api = {
      setTelemetryUploadPreferences: vi.fn().mockResolvedValue(undefined),
      uploadTelemetryOnError: vi.fn().mockResolvedValue(undefined)
    } as never
  })

  it('syncs upload preferences to main', async () => {
    await syncTelemetryUploadPreferencesToMain({ autoUploadDiagnostics: true })

    expect(globalThis.window.api.setTelemetryUploadPreferences).toHaveBeenCalledWith({
      autoUploadDiagnostics: true
    })
  })

  it('requests upload on error from main', async () => {
    await requestTelemetryUploadOnError()

    expect(globalThis.window.api.uploadTelemetryOnError).toHaveBeenCalledOnce()
  })

  it('no-ops when electron api is unavailable', async () => {
    globalThis.window.api = undefined as never

    await syncTelemetryUploadPreferencesToMain({ autoUploadDiagnostics: true })
    await requestTelemetryUploadOnError()
  })
})
