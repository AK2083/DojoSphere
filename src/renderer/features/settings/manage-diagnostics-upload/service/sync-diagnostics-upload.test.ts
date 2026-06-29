import { describe, expect, it, vi } from 'vitest'

import { syncDiagnosticsUploadPreferencesToMain } from './sync-diagnostics-upload'

describe('sync-diagnostics-upload', () => {
  it('forwards preferences to the main process', async () => {
    vi.stubGlobal('window', {
      api: {
        setDiagnosticsUploadPreferences: vi.fn().mockResolvedValue(undefined)
      }
    })

    await syncDiagnosticsUploadPreferencesToMain({ autoUploadDiagnostics: true })

    expect(globalThis.window.api.setDiagnosticsUploadPreferences).toHaveBeenCalledWith({
      autoUploadDiagnostics: true
    })
  })

  it('no-ops when preload API is unavailable', async () => {
    vi.stubGlobal('window', {})

    await expect(
      syncDiagnosticsUploadPreferencesToMain({ autoUploadDiagnostics: true })
    ).resolves.toBeUndefined()
  })
})
