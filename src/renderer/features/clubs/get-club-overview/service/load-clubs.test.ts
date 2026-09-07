import { afterEach, describe, expect, it } from 'vitest'

import { CLUB_MOCK_DATA } from '../model/club-mock-data'
import { loadClubs, resetClubsLoaderForStorybook, setClubsLoaderForStorybook } from './load-clubs'

describe('load-clubs service', () => {
  afterEach(() => {
    resetClubsLoaderForStorybook()
  })

  it('returns a clone of the default mock clubs', async () => {
    const clubs = await loadClubs()

    expect(clubs).toEqual(CLUB_MOCK_DATA)
    expect(clubs).not.toBe(CLUB_MOCK_DATA)
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
