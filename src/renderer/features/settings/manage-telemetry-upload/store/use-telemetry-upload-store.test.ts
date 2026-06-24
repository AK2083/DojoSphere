import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getTelemetryAutoUploadFromStorage,
  setTelemetryAutoUploadToStorage
} from '../service/telemetry-upload-storage'
import { useTelemetryUploadStore } from './use-telemetry-upload-store'

vi.mock('../service/telemetry-upload-storage', () => ({
  getTelemetryAutoUploadFromStorage: vi.fn(),
  setTelemetryAutoUploadToStorage: vi.fn()
}))

describe('useTelemetryUploadStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('defaults to disabled when storage is empty', () => {
    vi.mocked(getTelemetryAutoUploadFromStorage).mockReturnValue(null)

    const store = useTelemetryUploadStore()

    expect(store.autoUploadDiagnostics).toBe(false)
  })

  it('persists auto upload preference', () => {
    vi.mocked(getTelemetryAutoUploadFromStorage).mockReturnValue(false)
    const store = useTelemetryUploadStore()

    store.setAutoUploadDiagnostics(true)

    expect(store.autoUploadDiagnostics).toBe(true)
    expect(setTelemetryAutoUploadToStorage).toHaveBeenCalledWith(true)
  })
})
