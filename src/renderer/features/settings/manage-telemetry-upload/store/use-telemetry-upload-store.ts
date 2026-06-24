import { newStore } from '@shared/lib/pinia/store-define'

import {
  getTelemetryAutoUploadFromStorage,
  setTelemetryAutoUploadToStorage
} from '../service/telemetry-upload-storage'

const DEFAULT_AUTO_UPLOAD = false

/** Pinia store for automatic diagnostic upload preference. */
export const useTelemetryUploadStore = newStore('telemetry-upload', {
  state: () => ({
    autoUploadDiagnostics: getTelemetryAutoUploadFromStorage() ?? DEFAULT_AUTO_UPLOAD
  }),
  actions: {
    setAutoUploadDiagnostics(value: boolean) {
      this.autoUploadDiagnostics = value
      setTelemetryAutoUploadToStorage(value)
    }
  }
})
