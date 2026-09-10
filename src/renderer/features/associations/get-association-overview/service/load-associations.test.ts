import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useClubsStore } from '../../store/use-clubs-store'
import { CLUB_MOCK_DATA } from '../model/club-mock-data'
import {
  deleteClub,
  loadClubs,
  resetClubsLoaderForStorybook,
  setClubsLoaderForStorybook
} from './load-clubs'

describe('load-clubs service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useClubsStore().resetClubs()
  })

  afterEach(() => {
    resetClubsLoaderForStorybook()
  })

  it('returns clubs from the Pinia store by default', async () => {
    const clubs = await loadClubs()

    expect(clubs).toEqual(CLUB_MOCK_DATA)
    expect(clubs).not.toBe(useClubsStore().clubs)
  })

  it('deletes a club from the store', async () => {
    const id = CLUB_MOCK_DATA[0]!.id

    await deleteClub(id)

    expect(useClubsStore().getClubById(id)).toBeUndefined()
  })

  it('throws when deleting a missing club', async () => {
    await expect(deleteClub('missing-id')).rejects.toThrow('Club not found: missing-id')
  })

  it('uses an overridden storybook loader until reset', async () => {
    setClubsLoaderForStorybook(async () => [
      {
        ...CLUB_MOCK_DATA[0]!,
        id: 'story-club'
      }
    ])

    await expect(loadClubs()).resolves.toEqual([
      expect.objectContaining({
        id: 'story-club'
      })
    ])

    resetClubsLoaderForStorybook()

    await expect(loadClubs()).resolves.toEqual(CLUB_MOCK_DATA)
  })
})
