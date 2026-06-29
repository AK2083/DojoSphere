import { afterEach, describe, expect, it, vi } from 'vitest'

import { getIpcHandler } from '../../../test/electron-mock'

describe('registerDiagnosticsIpc', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('stores upload preferences from renderer', async () => {
    const { registerDiagnosticsIpc } = await import('./register')
    const { getDiagnosticsUploadPreferences, resetDiagnosticsUploadPreferencesForTests } =
      await import('../service/upload-preferences')

    resetDiagnosticsUploadPreferencesForTests()
    registerDiagnosticsIpc()

    getIpcHandler('diagnostics:setUploadPreferences')({}, { autoUploadDiagnostics: true })

    expect(getDiagnosticsUploadPreferences()).toEqual({ autoUploadDiagnostics: true })
  })
})
