import { computed, ref } from 'vue'
import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { logError } from '@shared/lib'

import { fetchSyncPayloadFromSupabase } from '../service/sync-from-supabase'

/** Dialog phases for the association cloud import flow. */
export type SyncPhase = 'legal' | 'syncing' | 'done'

/** Progress counters while association rows are applied locally. */
export type SyncProgress = {
  processed: number
  total: number
  currentName: string
}

/** Per-association import row shown in the sync dialog result list. */
export type SyncResultItem = {
  id: string
  name: string
  /** `null` while the row is still pending. */
  success: boolean | null
}

/** Toast shown after an import attempt finishes. */
export type SyncToast = {
  open: boolean
  color: 'success' | 'warning'
  count: number
}

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
 * Composable that owns state and orchestration for the cloud import dialog.
 *
 * Phases:
 *   legal   → legal / GDPR notice; user can cancel or confirm
 *   syncing → progress + live result list with check / cross icons
 *   done    → final result list; user closes the dialog
 *
 * A toast reports how many associations were imported (warning when 0).
 *
 * @returns Reactive sync state and action handlers for the sync dialog.
 */
export function useSyncAssociations() {
  const isOpen = ref(false)
  const phase = ref<SyncPhase>('legal')
  const progress = ref<SyncProgress>({ processed: 0, total: 0, currentName: '' })
  const results = ref<SyncResultItem[]>([])
  const errorMessage = ref<string | null>(null)
  const toast = ref<SyncToast>({ open: false, color: 'success', count: 0 })

  const importedCount = computed(() => results.value.filter((item) => item.success === true).length)

  function open() {
    isOpen.value = true
    phase.value = 'legal'
    progress.value = { processed: 0, total: 0, currentName: '' }
    results.value = []
    errorMessage.value = null
  }

  function close() {
    if (phase.value === 'syncing') {
      return
    }

    isOpen.value = false
  }

  function showToast(count: number) {
    toast.value = {
      open: true,
      color: count === 0 ? 'warning' : 'success',
      count
    }
  }

  function dismissToast() {
    toast.value = { ...toast.value, open: false }
  }

  function markRemainingFailed() {
    results.value = results.value.map((item) =>
      item.success === null ? { ...item, success: false } : item
    )
  }

  /**
   * Confirms the legal notice and imports association reference data.
   *
   * @returns `true` when import finished (including empty payload / partial row failures).
   */
  async function confirm(): Promise<boolean> {
    phase.value = 'syncing'
    progress.value = { processed: 0, total: 0, currentName: '' }
    results.value = []
    errorMessage.value = null

    let unsubscribeProgress: (() => void) | null = null

    try {
      const { api, token } = requireApi()
      const timestamps = await api.getSyncTimestamps(token)
      const payload = await fetchSyncPayloadFromSupabase(timestamps)
      const total = payload.associations.length

      results.value = payload.associations.map((assoc) => ({
        id: assoc.id,
        name: assoc.name,
        success: null
      }))

      if (total === 0) {
        progress.value = { processed: 0, total: 0, currentName: '' }
        showToast(0)
        isOpen.value = false
        phase.value = 'legal'
        return true
      }

      progress.value = { processed: 0, total, currentName: '' }

      unsubscribeProgress = api.onSyncProgress((event) => {
        progress.value = {
          processed: event.processed,
          total: event.total,
          currentName: event.currentName
        }

        results.value = results.value.map((item) =>
          item.id === event.id ? { ...item, success: event.success } : item
        )
      })

      await api.applySync(token, payload)

      progress.value = {
        processed: total,
        total,
        currentName: progress.value.currentName
      }
      showToast(importedCount.value)
      phase.value = 'done'
      return true
    } catch (error) {
      logError(error as Error, 'associations', 'sync-from-cloud')
      markRemainingFailed()
      errorMessage.value = String((error as Error).message ?? error)
      phase.value = results.value.length > 0 ? 'done' : 'legal'
      if (results.value.length > 0) {
        showToast(importedCount.value)
      }
      return false
    } finally {
      if (unsubscribeProgress) {
        unsubscribeProgress()
      }
    }
  }

  return {
    isOpen,
    phase,
    progress,
    results,
    importedCount,
    errorMessage,
    toast,
    open,
    close,
    confirm,
    dismissToast
  }
}
