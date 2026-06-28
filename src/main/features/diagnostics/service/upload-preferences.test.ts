import { beforeEach, describe, expect, it } from 'vitest'

import {
  getDiagnosticsUploadPreferences,
  resetDiagnosticsUploadPreferencesForTests,
  setDiagnosticsUploadPreferences
} from './upload-preferences'

describe('diagnostics upload preferences', () => {
  beforeEach(() => {
    resetDiagnosticsUploadPreferencesForTests()
  })

  it('stores auto upload preference', () => {
    setDiagnosticsUploadPreferences({ autoUploadDiagnostics: true })

    expect(getDiagnosticsUploadPreferences()).toEqual({ autoUploadDiagnostics: true })
  })

  it('coerces falsy values to false', () => {
    setDiagnosticsUploadPreferences({ autoUploadDiagnostics: false })

    expect(getDiagnosticsUploadPreferences()).toEqual({ autoUploadDiagnostics: false })
  })
})
