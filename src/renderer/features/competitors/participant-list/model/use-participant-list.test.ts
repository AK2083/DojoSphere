import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STATIC_PARTICIPANTS } from './static-participants'
import { useParticipantList } from './use-participant-list'

let onMountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onMounted: (callback: () => void) => {
      onMountedHandler = callback
    }
  }
})

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

describe('useParticipantList', () => {
  beforeEach(() => {
    onMountedHandler = undefined
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in a loading state with default sort', () => {
    const { loading, tableItems, sortBy, headers } = useParticipantList()

    expect(loading.value).toBe(true)
    expect(tableItems.value).toEqual([])
    expect(sortBy.value).toEqual([{ key: 'familyName', order: 'asc' }])
    expect(headers.value.some((header) => header.key === 'actions')).toBe(true)
  })

  it('loads static participants after the initial delay', () => {
    const { loading, tableItems } = useParticipantList()

    onMountedHandler?.()
    vi.advanceTimersByTime(400)

    expect(loading.value).toBe(false)
    expect(tableItems.value).toHaveLength(STATIC_PARTICIPANTS.length)
    expect(tableItems.value[0]?.givenName).toBe('Yuki')
    expect(tableItems.value[0]?.gender).toBe('competitors.participantList.gender.male')
  })

  it('exposes no-op CRUD handlers for the UI prototype', () => {
    const { handleAdd, handleEdit, handleDelete, tableItems } = useParticipantList()

    onMountedHandler?.()
    vi.advanceTimersByTime(400)

    expect(() => handleAdd()).not.toThrow()
    expect(() => handleEdit(tableItems.value[0]!)).not.toThrow()
    expect(() => handleDelete(tableItems.value[0]!)).not.toThrow()
  })
})
