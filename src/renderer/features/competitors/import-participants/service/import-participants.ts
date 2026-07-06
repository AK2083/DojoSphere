import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type {
  ImportExecuteResult,
  ImportPreviewResult,
  ImportProgressEvent
} from '@shared/types/electron-api'

function requireApi() {
  const api = globalThis.window.api

  if (!api) {
    throw new Error('Electron API is not available')
  }

  const token = getLocalSessionToken()

  if (!token) {
    throw new Error('No local session')
  }

  return { api, token }
}

/**
 * Requests an import preview (columns + auto-mapping) for a workbook file.
 *
 * @param buffer - Raw workbook contents read from the selected file.
 * @returns Detected columns and the suggested mapping.
 */
export async function previewImport(buffer: ArrayBuffer): Promise<ImportPreviewResult> {
  const { api, token } = requireApi()

  return api.importParticipantsPreview(token, buffer)
}

/**
 * Executes a participant import with a confirmed field-to-column mapping.
 *
 * @param buffer - Raw workbook contents read from the selected file.
 * @param mapping - Field key to column id mapping confirmed by the user.
 * @returns Per-row results and aggregate counts.
 */
export async function executeImport(
  buffer: ArrayBuffer,
  mapping: Record<string, string>
): Promise<ImportExecuteResult> {
  const { api, token } = requireApi()

  return api.importParticipantsExecute(token, buffer, { ...mapping })
}

/**
 * Subscribes to import progress events emitted during execution.
 *
 * @param listener - Callback invoked with each progress update.
 * @returns Unsubscribe function, or a no-op when the API is unavailable.
 */
export function onImportProgress(listener: (progress: ImportProgressEvent) => void): () => void {
  const api = globalThis.window.api

  if (!api?.onImportParticipantsProgress) {
    return () => undefined
  }

  return api.onImportParticipantsProgress(listener)
}
