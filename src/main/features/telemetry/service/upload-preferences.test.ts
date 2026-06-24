import { beforeEach, describe, expect, it } from 'vitest'

import {
  getTelemetryUploadPreferences,
  resetTelemetryUploadPreferences,
  setTelemetryUploadPreferences
} from './upload-preferences'

describe('upload-preferences', () => {
  beforeEach(() => {
    resetTelemetryUploadPreferences()
  })

  it('stores and returns telemetry upload preferences', () => {
    setTelemetryUploadPreferences({ autoUploadDiagnostics: true })

    expect(getTelemetryUploadPreferences()).toEqual({ autoUploadDiagnostics: true })
  })
})
