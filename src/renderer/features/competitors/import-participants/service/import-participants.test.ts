import type {
  ImportExecuteResult,
  ImportPreviewResult,
  ImportProgressEvent
} from '@shared/types/electron-api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { executeImport, onImportProgress, previewImport } from './import-participants'

const getLocalSessionToken = vi.fn()

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: () => getLocalSessionToken()
}))

const preview: ImportPreviewResult = {
  columns: [],
  fields: [],
  suggestedMapping: {},
  sources: {},
  mappingValid: false,
  missingRequiredFields: [],
  rowCount: 0
}

const executeResult: ImportExecuteResult = {
  results: [],
  importedCount: 0,
  failedCount: 0
}

describe('import-participants service', () => {
  beforeEach(() => {
    getLocalSessionToken.mockReset()
    getLocalSessionToken.mockReturnValue('token-1')
    globalThis.window.api = undefined as never
  })

  it('forwards the preview request with the session token', async () => {
    const importParticipantsPreview = vi.fn().mockResolvedValue(preview)
    globalThis.window.api = { importParticipantsPreview } as never

    const buffer = new ArrayBuffer(8)

    await expect(previewImport(buffer)).resolves.toBe(preview)
    expect(importParticipantsPreview).toHaveBeenCalledWith('token-1', buffer)
  })

  it('forwards the execute request with token, buffer and mapping', async () => {
    const importParticipantsExecute = vi.fn().mockResolvedValue(executeResult)
    globalThis.window.api = { importParticipantsExecute } as never

    const buffer = new ArrayBuffer(8)
    const mapping = { givenName: 'col-0' }

    await expect(executeImport(buffer, mapping)).resolves.toBe(executeResult)
    expect(importParticipantsExecute).toHaveBeenCalledWith('token-1', buffer, { ...mapping })
  })

  it('throws when the Electron API is unavailable', async () => {
    await expect(previewImport(new ArrayBuffer(1))).rejects.toThrow('Electron API is not available')
  })

  it('throws when no local session token exists', async () => {
    getLocalSessionToken.mockReturnValue(null)
    globalThis.window.api = { importParticipantsPreview: vi.fn() } as never

    await expect(previewImport(new ArrayBuffer(1))).rejects.toThrow('No local session')
  })

  it('subscribes to progress events and returns the unsubscribe handle', () => {
    const unsubscribe = vi.fn()
    const onImportParticipantsProgress = vi.fn().mockReturnValue(unsubscribe)
    globalThis.window.api = { onImportParticipantsProgress } as never

    const listener = (_progress: ImportProgressEvent) => undefined
    const handle = onImportProgress(listener)

    expect(onImportParticipantsProgress).toHaveBeenCalledWith(listener)
    expect(handle).toBe(unsubscribe)
  })

  it('returns a no-op unsubscribe when progress events are unsupported', () => {
    globalThis.window.api = undefined as never

    expect(() => onImportProgress(() => undefined)()).not.toThrow()
  })
})
