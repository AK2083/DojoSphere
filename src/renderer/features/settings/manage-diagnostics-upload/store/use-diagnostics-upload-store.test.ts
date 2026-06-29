import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getDiagnosticsAutoUploadFromStorage,
  setDiagnosticsAutoUploadToStorage
} from '../service/diagnostics-upload-storage'
import { useDiagnosticsUploadStore } from './use-diagnostics-upload-store'

vi.mock('../service/diagnostics-upload-storage', () => ({
  getDiagnosticsAutoUploadFromStorage: vi.fn(),
  setDiagnosticsAutoUploadToStorage: vi.fn()
}))

describe('useDiagnosticsUploadStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('defaults to disabled when storage is empty', () => {
    vi.mocked(getDiagnosticsAutoUploadFromStorage).mockReturnValue(null)

    const store = useDiagnosticsUploadStore()

    expect(store.autoUploadDiagnostics).toBe(false)
  })

  it('persists auto upload preference', () => {
    vi.mocked(getDiagnosticsAutoUploadFromStorage).mockReturnValue(false)
    const store = useDiagnosticsUploadStore()

    store.setAutoUploadDiagnostics(true)

    expect(store.autoUploadDiagnostics).toBe(true)
    expect(setDiagnosticsAutoUploadToStorage).toHaveBeenCalledWith(true)
  })
})
