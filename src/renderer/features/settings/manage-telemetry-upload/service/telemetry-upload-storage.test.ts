import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getTelemetryAutoUploadFromStorage,
  setTelemetryAutoUploadToStorage
} from './telemetry-upload-storage'

vi.mock('@shared/lib/browser/local-storage', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

import { getStorageItem, setStorageItem } from '@shared/lib/browser/local-storage'

describe('telemetry-upload-storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads auto upload preference from storage', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    expect(getTelemetryAutoUploadFromStorage()).toBe(true)
    expect(getStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.telemetry.autoUploadDiagnostics'
    )
  })

  it('writes auto upload preference to storage', () => {
    setTelemetryAutoUploadToStorage(false)

    expect(setStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.telemetry.autoUploadDiagnostics',
      false
    )
  })
})
