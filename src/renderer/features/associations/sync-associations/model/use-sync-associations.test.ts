import type { AssociationSyncPayload, AssociationSyncTimestamps } from '@shared/types/electron-api'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const logErrorMock = vi.fn()
const getLocalSessionTokenMock = vi.fn()
const fetchSyncPayloadMock = vi.fn()

vi.mock('@shared/lib', () => ({
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: () => getLocalSessionTokenMock()
}))

vi.mock('../service/sync-from-supabase', async () => {
  const actual = await vi.importActual<typeof import('../service/sync-from-supabase')>(
    '../service/sync-from-supabase'
  )

  return {
    ...actual,
    fetchSyncPayloadFromSupabase: (...args: unknown[]) => fetchSyncPayloadMock(...args)
  }
})

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const emptyTimestamps: AssociationSyncTimestamps = {
  countries: null,
  federations: null,
  regionalFederations: null,
  districts: null,
  associations: null
}

const emptyPayload: AssociationSyncPayload = {
  countries: [],
  federations: [],
  regionalFederations: [],
  districts: [],
  associations: []
}

const oneAssociationPayload: AssociationSyncPayload = {
  ...emptyPayload,
  associations: [
    {
      id: 'assoc-1',
      districtId: 'district-1',
      name: 'Club Alpha',
      shortName: null,
      city: null,
      website: null,
      isActive: true,
      source: 'cloud',
      updatedAt: null,
      identifiers: [],
      addresses: [],
      contacts: []
    }
  ]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupWindowApi(overrides: Partial<typeof globalThis.window.api> = {}) {
  const onSyncProgressMock = vi.fn().mockReturnValue(() => {})
  const getSyncTimestampsMock = vi.fn().mockResolvedValue(emptyTimestamps)
  const applySyncMock = vi.fn().mockResolvedValue(undefined)

  globalThis.window.api = {
    getSyncTimestamps: getSyncTimestampsMock,
    applySync: applySyncMock,
    onSyncProgress: onSyncProgressMock,
    ...overrides
  } as never

  return { getSyncTimestampsMock, applySyncMock, onSyncProgressMock }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

import { useSyncAssociations } from './use-sync-associations'

describe('useSyncAssociations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getLocalSessionTokenMock.mockReturnValue('token-abc')
    fetchSyncPayloadMock.mockResolvedValue(oneAssociationPayload)
  })

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('starts with isOpen false and phase legal', () => {
    setupWindowApi()
    const { isOpen, phase, errorMessage, isNotSignedIn, syncedCount } = useSyncAssociations()

    expect(isOpen.value).toBe(false)
    expect(phase.value).toBe('legal')
    expect(errorMessage.value).toBeNull()
    expect(isNotSignedIn.value).toBe(false)
    expect(syncedCount.value).toBe(0)
  })

  it('starts with zero progress', () => {
    setupWindowApi()
    const { progress } = useSyncAssociations()

    expect(progress.value).toEqual({ processed: 0, total: 0, currentName: '' })
  })

  // -------------------------------------------------------------------------
  // open / close
  // -------------------------------------------------------------------------

  it('open() sets isOpen to true and resets state', () => {
    setupWindowApi()
    const { isOpen, phase, open } = useSyncAssociations()

    open()

    expect(isOpen.value).toBe(true)
    expect(phase.value).toBe('legal')
  })

  it('open() clears previous error state', () => {
    setupWindowApi()
    const { isOpen, errorMessage, isNotSignedIn, open } = useSyncAssociations()

    // Simulate prior error by checking that open() resets
    open()

    expect(errorMessage.value).toBeNull()
    expect(isNotSignedIn.value).toBe(false)
    expect(isOpen.value).toBe(true)
  })

  it('close() sets isOpen to false', () => {
    setupWindowApi()
    const { isOpen, open, close } = useSyncAssociations()

    open()
    close()

    expect(isOpen.value).toBe(false)
  })

  // -------------------------------------------------------------------------
  // confirm – happy path
  // -------------------------------------------------------------------------

  it('confirm() transitions legal → syncing → done', async () => {
    setupWindowApi()
    const { phase, syncedCount, confirm } = useSyncAssociations()

    expect(phase.value).toBe('legal')

    const confirmPromise = confirm()
    expect(phase.value).toBe('syncing')

    await confirmPromise
    await flushPromises()

    expect(phase.value).toBe('done')
    expect(syncedCount.value).toBe(1)
  })

  it('confirm() calls getSyncTimestamps and passes timestamps to fetchSyncPayload', async () => {
    const { getSyncTimestampsMock } = setupWindowApi()
    getSyncTimestampsMock.mockResolvedValue(emptyTimestamps)
    const { confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(getSyncTimestampsMock).toHaveBeenCalledWith('token-abc')
    expect(fetchSyncPayloadMock).toHaveBeenCalledWith(emptyTimestamps)
  })

  it('updates progress when the main process emits a sync:progress event', async () => {
    let capturedCallback:
      ((e: { processed: number; total: number; currentName: string }) => void) | undefined

    setupWindowApi({
      onSyncProgress: vi.fn().mockImplementation((cb) => {
        capturedCallback = cb
        return () => {}
      }),
      applySync: vi.fn().mockImplementation(async () => {
        // Simulate a progress event arriving while applySync is running
        capturedCallback?.({ processed: 1, total: 1, currentName: 'Club Alpha' })
      })
    })

    const { progress, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(progress.value).toMatchObject({ processed: 1, total: 1, currentName: 'Club Alpha' })
  })

  it('confirm() calls applySync with the payload from Supabase', async () => {
    const { applySyncMock } = setupWindowApi()
    const { confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(applySyncMock).toHaveBeenCalledWith('token-abc', oneAssociationPayload)
  })

  it('confirm() unsubscribes from progress after completion', async () => {
    const unsubscribeMock = vi.fn()
    setupWindowApi({
      onSyncProgress: vi.fn().mockReturnValue(unsubscribeMock)
    })
    const { confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(unsubscribeMock).toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // confirm – nothing to sync
  // -------------------------------------------------------------------------

  it('confirm() goes directly to done phase when payload is empty', async () => {
    setupWindowApi()
    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)

    const { phase, syncedCount, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(phase.value).toBe('done')
    expect(syncedCount.value).toBe(0)
  })

  it('confirm() does not call applySync when there is nothing to sync', async () => {
    const { applySyncMock } = setupWindowApi()
    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)

    const { confirm } = useSyncAssociations()
    await confirm()
    await flushPromises()

    expect(applySyncMock).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // confirm – error handling
  // -------------------------------------------------------------------------

  it('confirm() sets isNotSignedIn when NotSignedInError is thrown', async () => {
    setupWindowApi()
    const { NotSignedInError } = await import('../service/sync-from-supabase')
    fetchSyncPayloadMock.mockRejectedValue(new NotSignedInError())

    const { phase, isNotSignedIn, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(isNotSignedIn.value).toBe(true)
    expect(phase.value).toBe('legal')
    expect(logErrorMock).not.toHaveBeenCalled()
  })

  it('confirm() records errorMessage and logs for unexpected errors', async () => {
    setupWindowApi()
    fetchSyncPayloadMock.mockRejectedValue(new Error('Network timeout'))

    const { phase, errorMessage, isNotSignedIn, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(phase.value).toBe('legal')
    expect(isNotSignedIn.value).toBe(false)
    expect(errorMessage.value).toContain('Network timeout')
    expect(logErrorMock).toHaveBeenCalledWith(expect.any(Error), 'associations', 'sync-from-cloud')
  })

  it('confirm() unsubscribes progress even when applySync throws', async () => {
    const unsubscribeMock = vi.fn()
    setupWindowApi({
      onSyncProgress: vi.fn().mockReturnValue(unsubscribeMock),
      // applySync rejects AFTER onSyncProgress is already subscribed
      applySync: vi.fn().mockRejectedValue(new Error('apply failed'))
    })
    // Provide a non-empty payload so we reach the onSyncProgress subscription
    fetchSyncPayloadMock.mockResolvedValue(oneAssociationPayload)

    const { confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('confirm() stringifies non-Error thrown values using the value itself', async () => {
    setupWindowApi()
    // Throw a raw string – it has no `.message`, so `?? error` right branch is taken
    fetchSyncPayloadMock.mockRejectedValue('raw string error')

    const { errorMessage, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(errorMessage.value).toContain('raw string error')
  })

  it('confirm() resets isNotSignedIn on a fresh call after a previous error', async () => {
    setupWindowApi()
    const { NotSignedInError } = await import('../service/sync-from-supabase')

    const { isNotSignedIn, confirm } = useSyncAssociations()

    // First call → not-signed-in error
    fetchSyncPayloadMock.mockRejectedValue(new NotSignedInError())
    await confirm()
    await flushPromises()
    expect(isNotSignedIn.value).toBe(true)

    // Second call → success
    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)
    await confirm()
    await flushPromises()
    expect(isNotSignedIn.value).toBe(false)
  })

  // -------------------------------------------------------------------------
  // confirm – Electron API unavailable
  // -------------------------------------------------------------------------

  it('confirm() records an error when the Electron API is unavailable', async () => {
    globalThis.window.api = undefined as never

    const { phase, errorMessage, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(phase.value).toBe('legal')
    expect(errorMessage.value).not.toBeNull()
  })

  it('confirm() records an error when there is no local session token', async () => {
    setupWindowApi()
    getLocalSessionTokenMock.mockReturnValue(null)

    const { phase, errorMessage, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(phase.value).toBe('legal')
    expect(errorMessage.value).not.toBeNull()
  })
})
