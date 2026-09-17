import { ref } from 'vue'
import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { logError } from '@shared/lib'

import { fetchSyncPayloadFromSupabase, NotSignedInError } from '../service/sync-from-supabase'

/**
 *
 */
export type SyncPhase = 'legal' | 'syncing' | 'done'

/**
 *
 */
export type SyncProgress = {
  processed: number
  total: number
  currentName: string
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
 * Composable that owns all state and orchestration for the cloud sync dialog.
 *
 * Phases:
 *   legal   → dialog shows legal notice; user can cancel or confirm
 *   syncing → dialog shows circular progress + X/Y counter + current name
 *   done    → dialog shows completion or "nothing new" message
 *
 * Emitting is handled by the caller (AssociationOverviewSection) which listens
 * for the `done` phase to trigger a list refresh.
 *
 * @returns Reactive sync state and action handlers for the sync dialog.
 */
export function useSyncAssociations() {
  const isOpen = ref(false)
  const phase = ref<SyncPhase>('legal')
  const progress = ref<SyncProgress>({ processed: 0, total: 0, currentName: '' })
  const errorMessage = ref<string | null>(null)
  const isNotSignedIn = ref(false)
  const syncedCount = ref(0)

  function open() {
    isOpen.value = true
    phase.value = 'legal'
    progress.value = { processed: 0, total: 0, currentName: '' }
    errorMessage.value = null
    isNotSignedIn.value = false
    syncedCount.value = 0
  }

  function close() {
    isOpen.value = false
  }

  /**
   * Called when the user clicks "Confirm" in the legal notice.
   *
   * Flow:
   * 1. Switch to 'syncing' phase
   * 2. Get local synced_at timestamps from main process via IPC
   * 3. Fetch changed rows from Supabase (filtered by updated_at > synced_at)
   * 4. Register progress listener
   * 5. Send payload to main process via IPC (applySyncBatch)
   * 6. Switch to 'done' phase on completion
   */
  async function confirm() {
    phase.value = 'syncing'
    progress.value = { processed: 0, total: 0, currentName: '' }
    errorMessage.value = null
    isNotSignedIn.value = false

    let unsubscribeProgress: (() => void) | null = null

    try {
      const { api, token } = requireApi()

      // 1. Get the latest synced_at per table
      const timestamps = await api.getSyncTimestamps(token)

      // 2. Fetch only changed records from Supabase
      const payload = await fetchSyncPayloadFromSupabase(timestamps)

      const total = payload.associations.length

      if (total === 0) {
        // Nothing to sync
        syncedCount.value = 0
        phase.value = 'done'
        return
      }

      // 3. Subscribe to per-association progress events from main
      progress.value = { processed: 0, total, currentName: '' }

      unsubscribeProgress = api.onSyncProgress((event) => {
        progress.value = {
          processed: event.processed,
          total: event.total,
          currentName: event.currentName
        }
      })

      // 4. Apply sync in main process (blocks until complete)
      await api.applySync(token, payload)

      syncedCount.value = total
      phase.value = 'done'
    } catch (error) {
      if (error instanceof NotSignedInError) {
        isNotSignedIn.value = true
      } else {
        logError(error as Error, 'associations', 'sync-from-cloud')
        errorMessage.value = String((error as Error).message ?? error)
      }
      // Reset to legal phase so user can read the error and retry
      phase.value = 'legal'
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
    errorMessage,
    isNotSignedIn,
    syncedCount,
    open,
    close,
    confirm
  }
}
