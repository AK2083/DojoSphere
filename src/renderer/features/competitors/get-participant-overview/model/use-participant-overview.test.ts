import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STATIC_PARTICIPANTS } from './static-participants'
import { useParticipantOverview } from './use-participant-overview'

let onMountedHandler: (() => void) | undefined
const push = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void) => {
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
  })
}))

describe('useParticipantOverview', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    push.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in a loading state with default sort', () => {
    const { loading, tableItems, sortBy, headers } = useParticipantOverview()

    expect(loading.value).toBe(true)
    expect(tableItems.value).toEqual([])
    expect(sortBy.value).toEqual([{ key: 'familyName', order: 'asc' }])
    expect(headers.value.some((header) => header.key === 'actions')).toBe(true)
  })

  it('loads static participants after the initial delay', () => {
    const { loading, tableItems } = useParticipantOverview()

    onMountedHandler?.()
    vi.advanceTimersByTime(400)

    expect(loading.value).toBe(false)
    expect(tableItems.value).toHaveLength(STATIC_PARTICIPANTS.length)
    expect(tableItems.value[0]?.givenName).toBe('Yuki')
    expect(tableItems.value[0]?.gender).toBe('competitors.getParticipantOverview.gender.male')
  })

  it('navigates to the participant create page when adding', () => {
    const { handleAdd } = useParticipantOverview()

    handleAdd()

    expect(push).toHaveBeenCalledWith({
      name: 'participant-create'
    })
  })

  it('navigates to the participant edit page when editing', () => {
    const { handleEdit, tableItems } = useParticipantOverview()

    onMountedHandler?.()
    vi.advanceTimersByTime(400)

    handleEdit(tableItems.value[0]!)

    expect(push).toHaveBeenCalledWith({
      name: 'participant-edit',
      params: { id: 'participant-1' }
    })
  })

  it('exposes a no-op delete handler for the UI prototype', () => {
    const { handleDelete, tableItems } = useParticipantOverview()

    onMountedHandler?.()
    vi.advanceTimersByTime(400)

    expect(() => handleDelete(tableItems.value[0]!)).not.toThrow()
  })
})
