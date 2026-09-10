import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { CLUB_MOCK_DATA } from '../get-club-overview/model/club-mock-data'
import { useClubsStore } from './use-clubs-store'

describe('useClubsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useClubsStore().resetClubs()
  })

  it('seeds clubs from the mock fixtures', () => {
    const store = useClubsStore()

    expect(store.listClubs()).toEqual(CLUB_MOCK_DATA)
  })

  it('creates, updates, and deletes clubs', () => {
    const store = useClubsStore()
    const created = {
      ...CLUB_MOCK_DATA[0]!,
      id: 'new-club',
      name: 'New Club'
    }

    store.createClub(created)
    expect(store.getClubById('new-club')?.name).toBe('New Club')

    store.updateClub({
      ...created,
      name: 'Updated Club'
    })
    expect(store.getClubById('new-club')?.name).toBe('Updated Club')

    expect(store.deleteClub('new-club')).toBe(true)
    expect(store.getClubById('new-club')).toBeUndefined()
    expect(store.deleteClub('missing')).toBe(false)
  })

  it('returns false when updating a missing club', () => {
    const store = useClubsStore()

    expect(
      store.updateClub({
        ...CLUB_MOCK_DATA[0]!,
        id: 'missing'
      })
    ).toBe(false)
  })

  it('exposes newest-first clubs through a getter', () => {
    const store = useClubsStore()
    const ids = store.clubsNewestFirst.map((club) => club.id)

    expect(ids[0]).toBe(CLUB_MOCK_DATA[0]!.id)
  })
})
