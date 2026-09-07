import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ClubOverviewRow } from './club-row'
import { useClubOverview } from './use-club-overview'

let onMountedHandler: (() => void | Promise<void>) | undefined
const loadClubsMock = vi.fn()
const logErrorMock = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void | Promise<void>) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  }),
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('../service/load-clubs', () => ({
  loadClubs: (...args: unknown[]) => loadClubsMock(...args)
}))

function createClub(overrides: Partial<ClubOverviewRow> = {}): ClubOverviewRow {
  return {
    id: 'club-1',
    name: 'Judoclub Nord e.V.',
    shortName: 'JC Nord',
    city: 'Hamburg',
    website: 'https://www.jcnord.example',
    isActive: true,
    source: 'manual',
    createdAt: '2026-03-01T10:00:00.000Z',
    districtName: 'Bezirk Hamburg',
    districtShortName: 'HH',
    regionalAssociationName: 'Hamburger Judo-Verband',
    regionalAssociationShortName: 'HJV',
    associationName: 'Deutscher Judo-Bund',
    associationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [],
    addresses: [],
    contacts: [],
    ...overrides
  }
}

describe('useClubOverview', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    logErrorMock.mockReset()
    loadClubsMock.mockReset()
    loadClubsMock.mockResolvedValue([createClub()])
  })

  it('starts in a loading state with field headers', () => {
    const { loading, overviewItems, fieldHeaders } = useClubOverview()

    expect(loading.value).toBe(true)
    expect(overviewItems.value).toEqual([])
    expect(fieldHeaders.value.some((header) => header.key === 'city')).toBe(true)
  })

  it('loads clubs from the mock service on mount', async () => {
    const { loading, overviewItems } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(loading.value).toBe(false)
    expect(overviewItems.value).toHaveLength(1)
    expect(overviewItems.value[0]?.name).toBe('Judoclub Nord e.V.')
    expect(overviewItems.value[0]?.statusLabel).toBe('clubs.getClubOverview.status.active')
  })

  it('sorts clubs with the newest entry first', async () => {
    loadClubsMock.mockResolvedValue([
      createClub({
        id: 'older',
        createdAt: '2026-01-01T00:00:00.000Z',
        name: 'Older Club'
      }),
      createClub({
        id: 'newer',
        createdAt: '2026-03-01T00:00:00.000Z',
        name: 'Newer Club'
      })
    ])

    const { overviewItems } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(overviewItems.value.map((club) => club.id)).toEqual(['newer', 'older'])
  })

  it('shows a stub message for add and edit actions', async () => {
    const { stubMessage, handleAdd, handleEdit, overviewItems } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    handleAdd()
    expect(stubMessage.value).toBe('clubs.getClubOverview.stubUnavailable')

    stubMessage.value = ''
    handleEdit(overviewItems.value[0]!)
    expect(stubMessage.value).toBe('clubs.getClubOverview.stubUnavailable')
  })

  it('removes a club from in-memory state on delete', async () => {
    loadClubsMock.mockResolvedValue([
      createClub({ id: 'keep' }),
      createClub({ id: 'remove', name: 'Remove Me', createdAt: '2026-02-01T00:00:00.000Z' })
    ])

    const { overviewItems, handleDelete } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    const toDelete = overviewItems.value.find((club) => club.id === 'remove')
    expect(toDelete).toBeDefined()
    handleDelete(toDelete!)

    expect(overviewItems.value.map((club) => club.id)).toEqual(['keep'])
  })

  it('maps inactive clubs to the inactive status label', async () => {
    loadClubsMock.mockResolvedValue([createClub({ isActive: false })])

    const { overviewItems } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(overviewItems.value[0]?.statusLabel).toBe('clubs.getClubOverview.status.inactive')
  })

  it('clears the stub message', async () => {
    const { stubMessage, handleAdd, clearStubMessage } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    handleAdd()
    expect(stubMessage.value).toBe('clubs.getClubOverview.stubUnavailable')

    clearStubMessage()
    expect(stubMessage.value).toBe('')
  })

  it('can refresh the list after the initial load', async () => {
    const { overviewItems, refresh } = useClubOverview()

    await onMountedHandler?.()
    await flushPromises()

    loadClubsMock.mockResolvedValue([createClub({ id: 'refreshed', name: 'Refreshed Club' })])
    await refresh()

    expect(overviewItems.value).toHaveLength(1)
    expect(overviewItems.value[0]?.id).toBe('refreshed')
  })

  it('records a load error when the mock service fails', async () => {
    loadClubsMock.mockRejectedValue(new Error('boom'))

    const { loading, loadErrorMessage, overviewItems, refresh } = useClubOverview()

    await refresh()

    expect(loading.value).toBe(false)
    expect(overviewItems.value).toEqual([])
    expect(loadErrorMessage.value).toBe('clubs.getClubOverview.loadError')
    expect(logErrorMock).toHaveBeenCalledWith(expect.any(Error), 'clubs', 'load-clubs')
  })
})
