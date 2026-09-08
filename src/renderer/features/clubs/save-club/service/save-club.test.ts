import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { CLUB_MOCK_DATA } from '../../get-club-overview/model/club-mock-data'
import { useClubsStore } from '../../store/use-clubs-store'
import { createClub, loadClub, updateClub } from './save-club'

describe('save-club service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useClubsStore().resetClubs()
  })

  it('loads, creates, and updates clubs through the store', async () => {
    const existing = await loadClub(CLUB_MOCK_DATA[0]!.id)
    expect(existing.name).toBe('Judoclub Nord e.V.')

    await createClub({
      ...CLUB_MOCK_DATA[0]!,
      id: 'created-club',
      name: 'Created Club'
    })
    expect((await loadClub('created-club')).name).toBe('Created Club')

    await updateClub({
      ...CLUB_MOCK_DATA[0]!,
      id: 'created-club',
      name: 'Updated Club'
    })
    expect((await loadClub('created-club')).name).toBe('Updated Club')
  })

  it('throws when loading or updating a missing club', async () => {
    await expect(loadClub('missing')).rejects.toThrow('Club not found: missing')
    await expect(
      updateClub({
        ...CLUB_MOCK_DATA[0]!,
        id: 'missing'
      })
    ).rejects.toThrow('Club not found: missing')
  })
})
