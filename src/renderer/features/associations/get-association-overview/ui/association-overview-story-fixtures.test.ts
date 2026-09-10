import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useClubsStore } from '../../store/use-clubs-store'
import { loadClubs, resetClubsLoaderForStorybook } from '../service/load-clubs'
import {
  installStorybookClubsLoader,
  installStorybookClubsLoaderError,
  installStorybookClubsLoaderLoading,
  resetStorybookClubsLoader,
  storyClubs,
  storyFieldHeaders
} from './club-overview-story-fixtures'

describe('club-overview-story-fixtures', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useClubsStore().resetClubs()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetStorybookClubsLoader()
  })

  it('provides story clubs with status labels', () => {
    expect(storyClubs.length).toBeGreaterThan(0)
    expect(storyClubs[0]?.statusLabel).toBe('Active')
    expect(storyClubs.some((club) => club.statusLabel === 'Inactive')).toBe(true)
  })

  it('includes the core summary and detail field headers', () => {
    const keys = storyFieldHeaders.map((header) => header.key)

    expect(keys).toEqual(
      expect.arrayContaining([
        'city',
        'website',
        'status',
        'district',
        'clubNumber',
        'headquarters',
        'trainingVenue',
        'billingAddress',
        'email',
        'phone'
      ])
    )
  })

  it('installs a storybook clubs loader with default fixtures', async () => {
    installStorybookClubsLoader()

    const clubs = await loadClubs()

    expect(clubs.map((club) => club.id)).toEqual(storyClubs.map((club) => club.id))
  })

  it('installs a custom clubs list in the storybook loader', async () => {
    const customClubs = [
      {
        ...storyClubs[0]!,
        id: 'custom-club'
      }
    ]

    installStorybookClubsLoader(customClubs)

    await expect(loadClubs()).resolves.toEqual([
      expect.objectContaining({
        id: 'custom-club'
      })
    ])
  })

  it('installs a storybook clubs loader that rejects', async () => {
    installStorybookClubsLoaderError()

    await expect(loadClubs()).rejects.toThrow('Clubs could not be loaded.')
  })

  it('installs a storybook clubs loader that stays pending until the delay elapses', async () => {
    vi.useFakeTimers()
    installStorybookClubsLoaderLoading(25)

    const pending = loadClubs()

    vi.advanceTimersByTime(25)

    await expect(pending).resolves.toEqual([])
  })

  it('restores the default clubs loader', async () => {
    installStorybookClubsLoader([])
    resetStorybookClubsLoader()

    const clubs = await loadClubs()

    expect(clubs.length).toBeGreaterThan(0)
    resetClubsLoaderForStorybook()
  })
})
