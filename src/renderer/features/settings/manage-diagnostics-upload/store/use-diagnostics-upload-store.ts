import { newStore } from '@shared/lib/pinia/store-define'

import {
  getDiagnosticsAutoUploadFromStorage,
  setDiagnosticsAutoUploadToStorage
} from '../service/diagnostics-upload-storage'

const DEFAULT_AUTO_UPLOAD = false

/** Pinia store for automatic diagnostic upload preference. */
export const useDiagnosticsUploadStore = newStore('diagnostics-upload', {
  state: () => ({
    autoUploadDiagnostics: getDiagnosticsAutoUploadFromStorage() ?? DEFAULT_AUTO_UPLOAD
  }),
  actions: {
    setAutoUploadDiagnostics(value: boolean) {
      this.autoUploadDiagnostics = value
      setDiagnosticsAutoUploadToStorage(value)
    }
  }
})
