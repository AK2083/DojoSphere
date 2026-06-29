import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getDiagnosticsAutoUploadFromStorage,
  setDiagnosticsAutoUploadToStorage
} from './diagnostics-upload-storage'

vi.mock('@shared/lib/browser/local-storage', () => ({
  getStorageItem: vi.fn(),
  removeStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

import {
  getStorageItem,
  removeStorageItem,
  setStorageItem
} from '@shared/lib/browser/local-storage'

describe('diagnostics-upload-storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads auto upload preference from storage', () => {
    vi.mocked(getStorageItem).mockReturnValue(true)

    expect(getDiagnosticsAutoUploadFromStorage()).toBe(true)
    expect(getStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.diagnostics.autoUploadDiagnostics'
    )
  })

  it('returns null when preference is unset', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    expect(getDiagnosticsAutoUploadFromStorage()).toBeNull()
  })

  it('migrates legacy telemetry storage key', () => {
    vi.mocked(getStorageItem).mockImplementation((key: string) => {
      if (key === 'dojosphere.settings.diagnostics.autoUploadDiagnostics') {
        return null
      }

      if (key === 'dojosphere.settings.telemetry.autoUploadDiagnostics') {
        return true
      }

      return null
    })

    expect(getDiagnosticsAutoUploadFromStorage()).toBe(true)
    expect(setStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.diagnostics.autoUploadDiagnostics',
      true
    )
    expect(removeStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.telemetry.autoUploadDiagnostics'
    )
  })

  it('writes auto upload preference to storage', () => {
    setDiagnosticsAutoUploadToStorage(false)

    expect(setStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.diagnostics.autoUploadDiagnostics',
      false
    )
    expect(removeStorageItem).toHaveBeenCalledWith(
      'dojosphere.settings.telemetry.autoUploadDiagnostics'
    )
  })
})
