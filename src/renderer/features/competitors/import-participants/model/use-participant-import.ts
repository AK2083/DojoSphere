import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IMPORT_PREVIEW_PARTICIPANTS,
  type ImportPreviewParticipant
} from './import-preview-participants'

const IMPORT_PROGRESS_INTERVAL_MS = 200
const IMPORT_PROGRESS_STEP = 10

/**
 * UI state for the participant import stepper (presentation only).
 *
 * @returns Step navigation and simulated import progress for the import flow.
 */
export function useParticipantImport() {
  const router = useRouter()
  const step = ref(0)
  const importProgress = ref(0)
  const isImportComplete = ref(false)
  const importResults = ref<ImportPreviewParticipant[]>(IMPORT_PREVIEW_PARTICIPANTS)
  let progressInterval: ReturnType<typeof globalThis.setInterval> | null = null

  const revealedResultCount = computed(() =>
    Math.min(
      importResults.value.length,
      Math.ceil(importProgress.value / (100 / importResults.value.length))
    )
  )

  const visibleResults = computed(() => importResults.value.slice(0, revealedResultCount.value))

  function clearProgressInterval(): void {
    if (progressInterval) {
      globalThis.clearInterval(progressInterval)
      progressInterval = null
    }
  }

  function startImport(): void {
    clearProgressInterval()
    importProgress.value = 0
    isImportComplete.value = false

    progressInterval = globalThis.setInterval(() => {
      importProgress.value = Math.min(100, importProgress.value + IMPORT_PROGRESS_STEP)

      if (importProgress.value >= 100) {
        clearProgressInterval()
        isImportComplete.value = true
      }
    }, IMPORT_PROGRESS_INTERVAL_MS)
  }

  function goNext(): void {
    if (step.value === 1) {
      step.value = 2
      startImport()
      return
    }

    if (step.value < 1) {
      step.value += 1
    }
  }

  function finish(): void {
    clearProgressInterval()
    void router.push({ name: 'participants' })
  }

  function cancel(): void {
    clearProgressInterval()
    void router.push({ name: 'participants' })
  }

  onUnmounted(() => {
    clearProgressInterval()
  })

  return {
    step,
    importProgress,
    isImportComplete,
    visibleResults,
    goNext,
    finish,
    cancel
  }
}
