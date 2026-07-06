import { defineComponent } from 'vue'
import type { ImportExecuteResult, ImportPreviewResult } from '@shared/types/electron-api'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type ParticipantImportController,
  provideParticipantImport
} from './use-participant-import'

const push = vi.fn()
const previewImport = vi.fn()
const executeImport = vi.fn()
const onImportProgress = vi.fn((_listener: (progress: unknown) => void) => () => undefined)

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  logError: vi.fn()
}))

vi.mock('../service/import-participants', () => ({
  previewImport: (buffer: ArrayBuffer) => previewImport(buffer),
  executeImport: (buffer: ArrayBuffer, mapping: Record<string, string>) =>
    executeImport(buffer, mapping),
  onImportProgress: (listener: (progress: unknown) => void) => onImportProgress(listener)
}))

function mountController(): ParticipantImportController {
  let controller: ParticipantImportController | undefined

  const Host = defineComponent({
    setup() {
      controller = provideParticipantImport()

      return () => null
    }
  })

  mount(Host)

  if (!controller) {
    throw new Error('Controller was not created')
  }

  return controller
}

function buildPreview(): ImportPreviewResult {
  return {
    columns: [
      { id: 'sheet1::0', sheetName: 'Sheet1', header: 'Vorname', sampleValues: ['Yuki'] },
      { id: 'sheet1::1', sheetName: 'Sheet1', header: 'Nachname', sampleValues: ['Tanaka'] }
    ],
    fields: [
      { key: 'givenName', required: true },
      { key: 'familyName', required: true },
      { key: 'club', required: false }
    ],
    suggestedMapping: { givenName: 'sheet1::0', familyName: 'sheet1::1' },
    sources: { givenName: 'header', familyName: 'header' },
    mappingValid: true,
    missingRequiredFields: [],
    rowCount: 1
  }
}

function buildFile(): File {
  const file = new File(['data'], 'participants.xlsx')

  file.arrayBuffer = async () => new ArrayBuffer(8)

  return file
}

describe('provideParticipantImport', () => {
  beforeEach(() => {
    push.mockClear()
    previewImport.mockReset()
    executeImport.mockReset()
    onImportProgress.mockClear()
  })

  it('starts on the first step with empty progress', () => {
    const controller = mountController()

    expect(controller.step.value).toBe(0)
    expect(controller.missingRequiredFieldKeys.value).toEqual([])
    expect(controller.importProgress.value).toBe(0)
    expect(controller.isImportComplete.value).toBe(false)
    expect(controller.results.value).toEqual([])
    expect(controller.mappingValid.value).toBe(false)
  })

  it('previews a selected file and applies the suggested mapping', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    expect(previewImport).toHaveBeenCalledOnce()
    expect(controller.step.value).toBe(1)
    expect(controller.mapping.value).toEqual({
      givenName: 'sheet1::0',
      familyName: 'sheet1::1'
    })
    expect(controller.mappingValid.value).toBe(true)
    expect(controller.missingRequiredFieldKeys.value).toEqual([])
  })

  it('reports missing required fields when a mapping is cleared', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.setMapping('givenName', '')

    expect(controller.mappingValid.value).toBe(false)
    expect(controller.missingRequiredFieldKeys.value).toEqual(['givenName'])
    expect(controller.sources.value.givenName).toBe('manual')
  })

  it('exposes the reverse column-to-field lookup', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    expect(controller.columnToField.value).toEqual({
      'sheet1::0': 'givenName',
      'sheet1::1': 'familyName'
    })
  })

  it('moves a column assignment from one field to another via setMapping', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.setMapping('club', 'sheet1::0')

    expect(controller.mapping.value.club).toBe('sheet1::0')
    expect(controller.mapping.value.givenName).toBeUndefined()
    expect(controller.columnToField.value['sheet1::0']).toBe('club')
  })

  it('assigns and reassigns a target field to a column', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.setColumnField('sheet1::0', 'club')

    expect(controller.mapping.value.club).toBe('sheet1::0')
    expect(controller.mapping.value.givenName).toBeUndefined()
    expect(controller.sources.value.club).toBe('manual')
    expect(controller.columnToField.value['sheet1::0']).toBe('club')
  })

  it('clears a column assignment when the empty field is chosen', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.setColumnField('sheet1::0', '')

    expect(controller.mapping.value.givenName).toBeUndefined()
    expect(controller.columnToField.value['sheet1::0']).toBeUndefined()
  })

  it('moves a target field from one column to another', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.setColumnField('sheet1::1', 'givenName')

    expect(controller.mapping.value.givenName).toBe('sheet1::1')
    expect(controller.mapping.value.familyName).toBeUndefined()
  })

  it('surfaces a preview error and stays on the first step', async () => {
    previewImport.mockRejectedValue(new Error('bad file'))
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    expect(controller.previewError.value).not.toBe('')
    expect(controller.preview.value).toBeNull()
    expect(controller.step.value).toBe(0)
  })

  it('executes the import and records results on the final step', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const executeResult: ImportExecuteResult = {
      results: [
        { index: 0, givenName: 'Yuki', familyName: 'Tanaka', club: 'Dojo', success: true },
        {
          index: 1,
          givenName: 'Max',
          familyName: 'Miller',
          club: 'JC',
          success: false,
          errorCode: 'validation_failed'
        }
      ],
      importedCount: 1,
      failedCount: 1
    }
    executeImport.mockResolvedValue(executeResult)
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.goNext()
    await flushPromises()

    expect(executeImport).toHaveBeenCalledOnce()
    expect(controller.step.value).toBe(2)
    expect(controller.isImportComplete.value).toBe(true)
    expect(controller.results.value).toHaveLength(2)
    expect(controller.importedCount.value).toBe(1)
    expect(controller.failedCount.value).toBe(1)
    expect(controller.importProgress.value).toBe(100)
  })

  it('shows an actionable message when the import throws', async () => {
    previewImport.mockResolvedValue(buildPreview())
    executeImport.mockRejectedValue(new Error('no such column: c.start_eligible'))
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.goNext()
    await flushPromises()

    expect(controller.importError.value).toBe(
      'competitors.importParticipants.steps.import.errors.databaseSchema'
    )
    expect(controller.isImportComplete.value).toBe(false)
  })

  it('does not advance to import while required fields are unmapped', async () => {
    const invalidPreview = buildPreview()
    invalidPreview.suggestedMapping = {}
    invalidPreview.sources = {}
    previewImport.mockResolvedValue(invalidPreview)
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.goNext()
    await flushPromises()

    expect(controller.step.value).toBe(1)
    expect(executeImport).not.toHaveBeenCalled()
  })

  it('navigates back to participants on finish and cancel', () => {
    const controller = mountController()

    controller.finish()
    controller.cancel()

    expect(push).toHaveBeenCalledTimes(2)
    expect(push).toHaveBeenCalledWith({ name: 'participants' })
  })

  it('clears state when file selection is removed', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    await controller.selectFile(null)
    await flushPromises()

    expect(controller.selectedFileName.value).toBe('')
    expect(controller.preview.value).toBeNull()
  })

  it('advances from step zero when preview already exists', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.step.value = 0
    controller.goNext()

    expect(controller.step.value).toBe(1)
  })

  it('stays on step zero when preview is missing', () => {
    const controller = mountController()

    controller.goNext()

    expect(controller.step.value).toBe(0)
  })

  it('does nothing when next is requested on the import step', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()
    controller.step.value = 2
    controller.goNext()

    expect(controller.step.value).toBe(2)
    expect(executeImport).not.toHaveBeenCalled()
  })

  it('ignores empty mapping targets in the reverse lookup', async () => {
    previewImport.mockResolvedValue(buildPreview())
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()

    controller.mapping.value = { givenName: '', familyName: 'sheet1::1' }

    expect(controller.columnToField.value).toEqual({ 'sheet1::1': 'familyName' })
  })

  it('updates progress while the import runs', async () => {
    previewImport.mockResolvedValue(buildPreview())
    executeImport.mockImplementation(async () => {
      const listener = onImportProgress.mock.calls.at(-1)?.[0] as
        ((progress: { processed: number; total: number }) => void) | undefined

      listener?.({ processed: 1, total: 2 })

      return {
        results: [
          { index: 0, givenName: 'Yuki', familyName: 'Tanaka', club: 'Dojo', success: true },
          { index: 1, givenName: 'Anna', familyName: 'Weber', club: 'JC', success: true }
        ],
        importedCount: 2,
        failedCount: 0
      }
    })
    const controller = mountController()

    await controller.selectFile(buildFile())
    await flushPromises()
    controller.goNext()
    await flushPromises()

    expect(controller.importProgress.value).toBe(100)
  })

  it('does not start the import when no file buffer is available', async () => {
    const controller = mountController()

    controller.preview.value = buildPreview()
    controller.mapping.value = { ...buildPreview().suggestedMapping }
    controller.step.value = 1
    controller.goNext()
    await flushPromises()

    expect(executeImport).not.toHaveBeenCalled()
    expect(controller.isImporting.value).toBe(false)
  })
})

describe('useParticipantImportContext', () => {
  it('throws when the controller was not provided', async () => {
    const { useParticipantImportContext } = await import('./use-participant-import')

    expect(() => useParticipantImportContext()).toThrow(
      'Participant import controller was not provided'
    )
  })

  it('returns the controller provided by an ancestor', async () => {
    const { defineComponent, h } = await import('vue')
    const { useParticipantImportContext, provideParticipantImport } =
      await import('./use-participant-import')

    let context: ParticipantImportController | undefined

    const Child = defineComponent({
      setup() {
        context = useParticipantImportContext()

        return () => null
      }
    })

    const Parent = defineComponent({
      setup() {
        provideParticipantImport()

        return () => h(Child)
      }
    })

    mount(Parent)

    expect(context).toBeDefined()
    expect(context?.step.value).toBe(0)
  })
})
