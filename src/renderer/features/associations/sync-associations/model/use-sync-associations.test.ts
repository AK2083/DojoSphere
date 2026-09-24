import type { AssociationSyncPayload, AssociationSyncTimestamps } from '@shared/types/electron-api'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const emptyTimestamps: AssociationSyncTimestamps = {
  countries: null,
  federations: null,
  regionalFederations: null,
  districts: null,
  associations: null,
  localAssociationIds: []
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

import { useSyncAssociations } from './use-sync-associations'

describe('useSyncAssociations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getLocalSessionTokenMock.mockReturnValue('token-abc')
    fetchSyncPayloadMock.mockResolvedValue(oneAssociationPayload)
  })

  it('starts with isOpen false and phase legal', () => {
    setupWindowApi()
    const { isOpen, phase, errorMessage, results } = useSyncAssociations()

    expect(isOpen.value).toBe(false)
    expect(phase.value).toBe('legal')
    expect(errorMessage.value).toBeNull()
    expect(results.value).toEqual([])
  })

  it('starts with zero progress', () => {
    setupWindowApi()
    const { progress } = useSyncAssociations()

    expect(progress.value).toEqual({ processed: 0, total: 0, currentName: '' })
  })

  it('open() sets isOpen to true and resets state', () => {
    setupWindowApi()
    const { isOpen, phase, open } = useSyncAssociations()

    open()

    expect(isOpen.value).toBe(true)
    expect(phase.value).toBe('legal')
  })

  it('close() sets isOpen to false', () => {
    setupWindowApi()
    const { isOpen, open, close } = useSyncAssociations()

    open()
    close()

    expect(isOpen.value).toBe(false)
  })

  it('close() stays open while syncing', async () => {
    setupWindowApi({
      applySync: vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20))
      })
    })
    const { isOpen, open, close, confirm, phase } = useSyncAssociations()

    open()
    const confirmPromise = confirm()
    expect(phase.value).toBe('syncing')
    close()
    expect(isOpen.value).toBe(true)

    await confirmPromise
    await flushPromises()
  })

  it('confirm() keeps the dialog open on the done phase after a successful import', async () => {
    setupWindowApi({
      onSyncProgress: vi.fn().mockImplementation((cb) => {
        cb({
          processed: 1,
          total: 1,
          currentName: 'Club Alpha',
          id: 'assoc-1',
          success: true
        })
        return () => {}
      })
    })
    const { isOpen, open, phase, results, toast, confirm } = useSyncAssociations()

    open()
    const succeeded = await confirm()
    await flushPromises()

    expect(succeeded).toBe(true)
    expect(isOpen.value).toBe(true)
    expect(phase.value).toBe('done')
    expect(results.value).toEqual([{ id: 'assoc-1', name: 'Club Alpha', success: true }])
    expect(toast.value).toEqual({ open: true, color: 'success', count: 1 })
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
      | ((e: {
          processed: number
          total: number
          currentName: string
          id: string
          success: boolean
        }) => void)
      | undefined

    setupWindowApi({
      onSyncProgress: vi.fn().mockImplementation((cb) => {
        capturedCallback = cb
        return () => {}
      }),
      applySync: vi.fn().mockImplementation(async () => {
        capturedCallback?.({
          processed: 1,
          total: 1,
          currentName: 'Club Alpha',
          id: 'assoc-1',
          success: true
        })
      })
    })

    const { progress, results, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(progress.value).toMatchObject({ processed: 1, total: 1, currentName: 'Club Alpha' })
    expect(results.value[0]?.success).toBe(true)
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

  it('confirm() closes immediately and shows a warning toast when payload is empty', async () => {
    setupWindowApi()
    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)

    const { isOpen, open, phase, toast, confirm } = useSyncAssociations()
    open()

    const succeeded = await confirm()
    await flushPromises()

    expect(succeeded).toBe(true)
    expect(isOpen.value).toBe(false)
    expect(phase.value).toBe('legal')
    expect(toast.value).toEqual({ open: true, color: 'warning', count: 0 })
  })

  it('confirm() does not call applySync when there is nothing to sync', async () => {
    const { applySyncMock } = setupWindowApi()
    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)

    const { confirm } = useSyncAssociations()
    await confirm()
    await flushPromises()

    expect(applySyncMock).not.toHaveBeenCalled()
  })

  it('confirm() records errorMessage and logs for unexpected errors', async () => {
    setupWindowApi()
    fetchSyncPayloadMock.mockRejectedValue(new Error('Network timeout'))

    const { phase, errorMessage, confirm } = useSyncAssociations()

    const succeeded = await confirm()
    await flushPromises()

    expect(succeeded).toBe(false)
    expect(phase.value).toBe('legal')
    expect(errorMessage.value).toContain('Network timeout')
    expect(logErrorMock).toHaveBeenCalledWith(expect.any(Error), 'associations', 'sync-from-cloud')
  })

  it('confirm() keeps the result list when applySync throws after results were built', async () => {
    const unsubscribeMock = vi.fn()
    setupWindowApi({
      onSyncProgress: vi.fn().mockReturnValue(unsubscribeMock),
      applySync: vi.fn().mockRejectedValue(new Error('apply failed'))
    })
    fetchSyncPayloadMock.mockResolvedValue(oneAssociationPayload)

    const { phase, results, toast, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(unsubscribeMock).toHaveBeenCalled()
    expect(phase.value).toBe('done')
    expect(results.value).toEqual([{ id: 'assoc-1', name: 'Club Alpha', success: false }])
    expect(toast.value).toEqual({ open: true, color: 'warning', count: 0 })
  })

  it('confirm() keeps already resolved results when applySync fails mid-way', async () => {
    const twoAssociationPayload: AssociationSyncPayload = {
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
        },
        {
          id: 'assoc-2',
          districtId: 'district-1',
          name: 'Club Beta',
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

    let capturedCallback:
      | ((e: {
          processed: number
          total: number
          currentName: string
          id: string
          success: boolean
        }) => void)
      | undefined

    setupWindowApi({
      onSyncProgress: vi.fn().mockImplementation((cb) => {
        capturedCallback = cb
        return () => {}
      }),
      applySync: vi.fn().mockImplementation(async () => {
        capturedCallback?.({
          processed: 1,
          total: 2,
          currentName: 'Club Alpha',
          id: 'assoc-1',
          success: true
        })
        throw new Error('apply failed after first club')
      })
    })
    fetchSyncPayloadMock.mockResolvedValue(twoAssociationPayload)

    const { results, toast, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(results.value).toEqual([
      { id: 'assoc-1', name: 'Club Alpha', success: true },
      { id: 'assoc-2', name: 'Club Beta', success: false }
    ])
    expect(toast.value).toEqual({ open: true, color: 'success', count: 1 })
  })

  it('confirm() stringifies non-Error thrown values using the value itself', async () => {
    setupWindowApi()
    fetchSyncPayloadMock.mockRejectedValue('raw string error')

    const { errorMessage, confirm } = useSyncAssociations()

    await confirm()
    await flushPromises()

    expect(errorMessage.value).toContain('raw string error')
  })

  it('confirm() clears a previous errorMessage on a fresh successful call', async () => {
    setupWindowApi()
    const { errorMessage, confirm } = useSyncAssociations()

    fetchSyncPayloadMock.mockRejectedValue(new Error('temporary failure'))
    await confirm()
    await flushPromises()
    expect(errorMessage.value).toContain('temporary failure')

    fetchSyncPayloadMock.mockResolvedValue(emptyPayload)
    await confirm()
    await flushPromises()
    expect(errorMessage.value).toBeNull()
  })

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

  it('dismissToast() closes the toast', () => {
    setupWindowApi()
    const { toast, dismissToast } = useSyncAssociations()
    toast.value = { open: true, color: 'success', count: 3 }

    dismissToast()

    expect(toast.value.open).toBe(false)
  })
})
