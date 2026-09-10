import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AssociationOverviewRow } from './association-row'
import { useAssociationOverview } from './use-association-overview'

let onMountedHandler: (() => void | Promise<void>) | undefined
const loadAssociationsMock = vi.fn()
const deleteAssociationMock = vi.fn()
const logErrorMock = vi.fn()
const push = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void | Promise<void>) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  }),
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('../service/load-associations', () => ({
  loadAssociations: (...args: unknown[]) => loadAssociationsMock(...args),
  deleteAssociation: (...args: unknown[]) => deleteAssociationMock(...args)
}))

function createAssociation(
  overrides: Partial<AssociationOverviewRow> = {}
): AssociationOverviewRow {
  return {
    id: 'association-1',
    name: 'Judoclub Nord e.V.',
    shortName: 'JC Nord',
    city: 'Hamburg',
    website: 'https://www.jcnord.example',
    isActive: true,
    source: 'manual',
    createdAt: '2026-03-01T10:00:00.000Z',
    districtName: 'Bezirk Hamburg',
    districtShortName: 'HH',
    regionalFederationName: 'Hamburger Judo-Verband',
    regionalFederationShortName: 'HJV',
    federationName: 'Deutscher Judo-Bund',
    federationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [],
    addresses: [],
    contacts: [],
    ...overrides
  }
}

describe('useAssociationOverview', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    logErrorMock.mockReset()
    push.mockReset()
    loadAssociationsMock.mockReset()
    loadAssociationsMock.mockResolvedValue([createAssociation()])
    deleteAssociationMock.mockReset()
    deleteAssociationMock.mockResolvedValue(undefined)
  })

  it('starts in a loading state with field headers', () => {
    const { loading, overviewItems, fieldHeaders } = useAssociationOverview()

    expect(loading.value).toBe(true)
    expect(overviewItems.value).toEqual([])
    expect(fieldHeaders.value.some((header) => header.key === 'city')).toBe(true)
    expect(fieldHeaders.value.some((header) => header.key === 'associationNumber')).toBe(true)
  })

  it('loads associations from the store-backed service on mount', async () => {
    const { loading, overviewItems } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(loading.value).toBe(false)
    expect(overviewItems.value).toHaveLength(1)
    expect(overviewItems.value[0]?.name).toBe('Judoclub Nord e.V.')
    expect(overviewItems.value[0]?.statusLabel).toBe(
      'associations.getAssociationOverview.status.active'
    )
  })

  it('sorts associations with the newest entry first', async () => {
    loadAssociationsMock.mockResolvedValue([
      createAssociation({
        id: 'older',
        createdAt: '2026-01-01T00:00:00.000Z',
        name: 'Older Association'
      }),
      createAssociation({
        id: 'newer',
        createdAt: '2026-03-01T00:00:00.000Z',
        name: 'Newer Association'
      })
    ])

    const { overviewItems } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(overviewItems.value.map((association) => association.id)).toEqual(['newer', 'older'])
  })

  it('navigates to create and edit routes', async () => {
    const { handleAdd, handleEdit, overviewItems } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    handleAdd()
    expect(push).toHaveBeenCalledWith({ name: 'association-create' })

    handleEdit(overviewItems.value[0]!)
    expect(push).toHaveBeenCalledWith({
      name: 'association-edit',
      params: { id: 'association-1' }
    })
  })

  it('deletes a association through the store-backed service and refreshes', async () => {
    loadAssociationsMock
      .mockResolvedValueOnce([
        createAssociation({ id: 'keep' }),
        createAssociation({
          id: 'remove',
          name: 'Remove Me',
          createdAt: '2026-02-01T00:00:00.000Z'
        })
      ])
      .mockResolvedValueOnce([createAssociation({ id: 'keep' })])

    const { overviewItems, handleDelete } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    const toDelete = overviewItems.value.find((association) => association.id === 'remove')
    expect(toDelete).toBeDefined()
    await handleDelete(toDelete!)

    expect(deleteAssociationMock).toHaveBeenCalledWith('remove')
    expect(overviewItems.value.map((association) => association.id)).toEqual(['keep'])
  })

  it('records a delete error when the store-backed service fails', async () => {
    deleteAssociationMock.mockRejectedValue(new Error('boom'))

    const { overviewItems, handleDelete, loadErrorMessage } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    await handleDelete(overviewItems.value[0]!)

    expect(loadErrorMessage.value).toBe('associations.getAssociationOverview.loadError')
    expect(logErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      'associations',
      'delete-association'
    )
  })

  it('maps inactive associations to the inactive status label', async () => {
    loadAssociationsMock.mockResolvedValue([createAssociation({ isActive: false })])

    const { overviewItems } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(overviewItems.value[0]?.statusLabel).toBe(
      'associations.getAssociationOverview.status.inactive'
    )
  })

  it('can refresh the list after the initial load', async () => {
    const { overviewItems, refresh } = useAssociationOverview()

    await onMountedHandler?.()
    await flushPromises()

    loadAssociationsMock.mockResolvedValue([
      createAssociation({ id: 'refreshed', name: 'Refreshed Association' })
    ])
    await refresh()

    expect(overviewItems.value).toHaveLength(1)
    expect(overviewItems.value[0]?.id).toBe('refreshed')
  })

  it('records a load error when the service fails', async () => {
    loadAssociationsMock.mockRejectedValue(new Error('boom'))

    const { loading, loadErrorMessage, overviewItems, refresh } = useAssociationOverview()

    await refresh()

    expect(loading.value).toBe(false)
    expect(overviewItems.value).toEqual([])
    expect(loadErrorMessage.value).toBe('associations.getAssociationOverview.loadError')
    expect(logErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      'associations',
      'load-associations'
    )
  })
})
