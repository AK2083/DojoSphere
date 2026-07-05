import { computed, type ComputedRef, inject, type InjectionKey, provide, type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logError, useTranslation } from '@shared/lib'
import type {
  ImportColumnMappingSource,
  ImportPreviewResult,
  ImportRowResult
} from '@shared/types/electron-api'

import { importErrorLogMessage, importErrorTranslationKey } from '../model/resolve-import-error'
import { executeImport, onImportProgress, previewImport } from '../service/import-participants'

/** Reactive controller shared across the import stepper steps. */
export type ParticipantImportController = {
  step: Ref<number>
  selectedFileName: Ref<string>
  isPreviewing: Ref<boolean>
  previewError: Ref<string>
  preview: Ref<ImportPreviewResult | null>
  mapping: Ref<Record<string, string>>
  sources: Ref<Record<string, ImportColumnMappingSource>>
  mappingValid: ComputedRef<boolean>
  missingRequiredFieldKeys: ComputedRef<string[]>
  isImporting: Ref<boolean>
  importError: Ref<string>
  importProgress: ComputedRef<number>
  isImportComplete: Ref<boolean>
  results: Ref<ImportRowResult[]>
  importedCount: ComputedRef<number>
  failedCount: ComputedRef<number>
  /** Reverse lookup: source column id to its currently assigned target field. */
  columnToField: ComputedRef<Record<string, string>>
  selectFile: (file: File | null) => Promise<void>
  setMapping: (fieldKey: string, columnId: string) => void
  /** Assigns (or clears with an empty field key) the target field for a column. */
  setColumnField: (columnId: string, fieldKey: string) => void
  goNext: () => void
  finish: () => void
  cancel: () => void
}

const IMPORT_CONTROLLER_KEY: InjectionKey<ParticipantImportController> = Symbol(
  'participant-import-controller'
)

function requiredFieldKeys(preview: ImportPreviewResult | null): string[] {
  return preview ? preview.fields.filter((field) => field.required).map((field) => field.key) : []
}

/**
 * Creates the participant import controller and provides it to child steps.
 *
 * @returns The reactive import controller.
 */
export function provideParticipantImport(): ParticipantImportController {
  const controller = createController()

  provide(IMPORT_CONTROLLER_KEY, controller)

  return controller
}

/**
 * Injects the participant import controller provided by the stepper.
 *
 * @returns The reactive import controller.
 */
export function useParticipantImportContext(): ParticipantImportController {
  const controller = inject(IMPORT_CONTROLLER_KEY)

  if (!controller) {
    throw new Error('Participant import controller was not provided')
  }

  return controller
}

function createController(): ParticipantImportController {
  const router = useRouter()
  const { t } = useTranslation()

  const step = ref(0)
  const selectedFileName = ref('')
  const fileBuffer = ref<ArrayBuffer | null>(null)

  const isPreviewing = ref(false)
  const previewError = ref('')
  const preview = ref<ImportPreviewResult | null>(null)
  const mapping = ref<Record<string, string>>({})
  const sources = ref<Record<string, ImportColumnMappingSource>>({})

  const isImporting = ref(false)
  const importError = ref('')
  const processed = ref(0)
  const total = ref(0)
  const isImportComplete = ref(false)
  const results = ref<ImportRowResult[]>([])

  const columnToField = computed(() => {
    const reverse: Record<string, string> = {}

    for (const [fieldKey, columnId] of Object.entries(mapping.value)) {
      if (columnId) {
        reverse[columnId] = fieldKey
      }
    }

    return reverse
  })

  const missingRequiredFieldKeys = computed(() =>
    requiredFieldKeys(preview.value).filter((key) => !mapping.value[key])
  )

  const mappingValid = computed(
    () => preview.value != null && missingRequiredFieldKeys.value.length === 0
  )

  const importProgress = computed(() =>
    total.value > 0 ? Math.round((processed.value / total.value) * 100) : 0
  )

  const importedCount = computed(() => results.value.filter((result) => result.success).length)
  const failedCount = computed(() => results.value.filter((result) => !result.success).length)

  async function selectFile(file: File | null): Promise<void> {
    previewError.value = ''
    preview.value = null
    mapping.value = {}
    sources.value = {}
    selectedFileName.value = file?.name ?? ''

    if (!file) {
      fileBuffer.value = null
      return
    }

    isPreviewing.value = true

    try {
      const buffer = await file.arrayBuffer()
      fileBuffer.value = buffer

      const result = await previewImport(buffer)

      preview.value = result
      mapping.value = { ...result.suggestedMapping }
      sources.value = { ...result.sources }
      step.value = 1
    } catch (error) {
      previewError.value = t(importErrorTranslationKey(error))
      logError(new Error(importErrorLogMessage(error)), 'competitors', 'import-preview')
    } finally {
      isPreviewing.value = false
    }
  }

  function setMapping(fieldKey: string, columnId: string): void {
    const nextMapping = { ...mapping.value }
    const nextSources = { ...sources.value }

    if (columnId) {
      for (const key of Object.keys(nextMapping)) {
        if (key !== fieldKey && nextMapping[key] === columnId) {
          delete nextMapping[key]
          delete nextSources[key]
        }
      }

      nextMapping[fieldKey] = columnId
    } else {
      delete nextMapping[fieldKey]
    }

    nextSources[fieldKey] = 'manual'
    mapping.value = nextMapping
    sources.value = nextSources
  }

  function setColumnField(columnId: string, fieldKey: string): void {
    const nextMapping = { ...mapping.value }
    const nextSources = { ...sources.value }

    for (const key of Object.keys(nextMapping)) {
      if (nextMapping[key] === columnId) {
        delete nextMapping[key]
        delete nextSources[key]
      }
    }

    if (fieldKey) {
      nextMapping[fieldKey] = columnId
      nextSources[fieldKey] = 'manual'
    }

    mapping.value = nextMapping
    sources.value = nextSources
  }

  async function runImport(): Promise<void> {
    if (!fileBuffer.value) {
      return
    }

    isImporting.value = true
    importError.value = ''
    isImportComplete.value = false
    results.value = []
    processed.value = 0
    total.value = 0

    const unsubscribe = onImportProgress((progress) => {
      processed.value = progress.processed
      total.value = progress.total
    })

    try {
      const result = await executeImport(fileBuffer.value, mapping.value)

      results.value = result.results
      total.value = result.results.length
      processed.value = result.results.length
      isImportComplete.value = true
    } catch (error) {
      importError.value = t(importErrorTranslationKey(error))
      logError(new Error(importErrorLogMessage(error)), 'competitors', 'import-execute')
    } finally {
      unsubscribe()
      isImporting.value = false
    }
  }

  function goNext(): void {
    if (step.value === 0) {
      if (preview.value) {
        step.value = 1
      }

      return
    }

    if (step.value === 1) {
      if (!mappingValid.value) {
        return
      }

      step.value = 2
      void runImport()
    }
  }

  function finish(): void {
    void router.push({ name: 'participants' })
  }

  function cancel(): void {
    void router.push({ name: 'participants' })
  }

  return {
    step,
    selectedFileName,
    isPreviewing,
    previewError,
    preview,
    mapping,
    sources,
    mappingValid,
    missingRequiredFieldKeys,
    isImporting,
    importError,
    importProgress,
    isImportComplete,
    results,
    importedCount,
    failedCount,
    columnToField,
    selectFile,
    setMapping,
    setColumnField,
    goNext,
    finish,
    cancel
  }
}
