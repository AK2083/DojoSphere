import type { Competitor } from '@shared/types/electron-api'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useParticipantOverview } from './use-participant-overview'

let onMountedHandler: (() => void | Promise<void>) | undefined
const push = vi.fn()
const loadParticipantsMock = vi.fn()
const deleteParticipantMock = vi.fn()
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

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  }),
  logError: (...args: unknown[]) => logErrorMock(...args)
}))

vi.mock('../service/load-participants', () => ({
  loadParticipants: (...args: unknown[]) => loadParticipantsMock(...args),
  deleteParticipant: (...args: unknown[]) => deleteParticipantMock(...args)
}))

function createCompetitor(overrides: Partial<Competitor> = {}): Competitor {
  return {
    id: 'competitor-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    club: 'Dojo Nord',
    weightClass: '-60',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: null,
    ...overrides
  }
}

describe('useParticipantOverview', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    push.mockClear()
    logErrorMock.mockReset()
    loadParticipantsMock.mockReset()
    loadParticipantsMock.mockResolvedValue([createCompetitor()])
    deleteParticipantMock.mockReset()
    deleteParticipantMock.mockResolvedValue(undefined)
  })

  it('starts in a loading state with default sort', () => {
    const { loading, tableItems, sortBy, headers } = useParticipantOverview()

    expect(loading.value).toBe(true)
    expect(tableItems.value).toEqual([])
    expect(sortBy.value).toEqual([{ key: 'familyName', order: 'asc' }])
    expect(headers.value.some((header) => header.key === 'actions')).toBe(true)
  })

  it('loads participants from the database on mount', async () => {
    const { loading, tableItems } = useParticipantOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(loading.value).toBe(false)
    expect(tableItems.value).toHaveLength(1)
    expect(tableItems.value[0]?.givenName).toBe('Yuki')
    expect(tableItems.value[0]?.gender).toBe('competitors.getParticipantOverview.gender.male')
  })

  it('records an error message when loading fails', async () => {
    loadParticipantsMock.mockRejectedValueOnce(new Error('boom'))
    const { loading, loadErrorMessage } = useParticipantOverview()

    await onMountedHandler?.()
    await flushPromises()

    expect(loading.value).toBe(false)
    expect(loadErrorMessage.value).toBe('competitors.getParticipantOverview.loadError')
    expect(logErrorMock).toHaveBeenCalled()
  })

  it('navigates to the participant create page when adding', () => {
    const { handleAdd } = useParticipantOverview()

    handleAdd()

    expect(push).toHaveBeenCalledWith({
      name: 'participant-create'
    })
  })

  it('navigates to the participant edit page when editing', async () => {
    const { handleEdit, tableItems } = useParticipantOverview()

    await onMountedHandler?.()
    await flushPromises()

    handleEdit(tableItems.value[0]!)

    expect(push).toHaveBeenCalledWith({
      name: 'participant-edit',
      params: { id: 'competitor-1' }
    })
  })

  it('deletes a participant and reloads the list', async () => {
    const { handleDelete, tableItems } = useParticipantOverview()

    await onMountedHandler?.()
    await flushPromises()

    await handleDelete(tableItems.value[0]!)

    expect(deleteParticipantMock).toHaveBeenCalledWith('competitor-1')
    expect(loadParticipantsMock).toHaveBeenCalledTimes(2)
  })

  it('records an error message when deleting fails', async () => {
    deleteParticipantMock.mockRejectedValueOnce(new Error('boom'))
    const { handleDelete, tableItems, loadErrorMessage } = useParticipantOverview()

    await onMountedHandler?.()
    await flushPromises()

    await handleDelete(tableItems.value[0]!)

    expect(loadErrorMessage.value).toBe('competitors.getParticipantOverview.loadError')
    expect(logErrorMock).toHaveBeenCalled()
  })
})
