import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadAssociations, resetAssociationsLoaderForStorybook } from '../service/load-associations'
import {
  installStorybookAssociationsLoader,
  installStorybookAssociationsLoaderError,
  installStorybookAssociationsLoaderLoading,
  resetStorybookAssociationsLoader,
  storyAssociations,
  storyFieldHeaders
} from './association-overview-story-fixtures'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

describe('association-overview-story-fixtures', () => {
  beforeEach(() => {
    resetAssociationsLoaderForStorybook()
    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
    globalThis.window.api = {
      getAssociations: vi.fn().mockResolvedValue([{ id: 'ipc-association' }])
    } as never
  })

  afterEach(() => {
    vi.useRealTimers()
    resetStorybookAssociationsLoader()
  })

  it('provides story associations with status labels', () => {
    expect(storyAssociations.length).toBeGreaterThan(0)
    expect(storyAssociations[0]?.statusLabel).toBe('Active')
    expect(storyAssociations.some((association) => association.statusLabel === 'Inactive')).toBe(
      true
    )
  })

  it('includes the core summary and detail field headers', () => {
    const keys = storyFieldHeaders.map((header) => header.key)

    expect(keys).toEqual(
      expect.arrayContaining([
        'city',
        'website',
        'status',
        'district',
        'associationNumber',
        'headquarters',
        'trainingVenue',
        'billingAddress',
        'email',
        'phone'
      ])
    )
  })

  it('installs a storybook associations loader with default fixtures', async () => {
    installStorybookAssociationsLoader()

    const associations = await loadAssociations()

    expect(associations.map((association) => association.id)).toEqual(
      storyAssociations.map((association) => association.id)
    )
  })

  it('installs a custom associations list in the storybook loader', async () => {
    const customAssociations = [
      {
        ...storyAssociations[0]!,
        id: 'custom-association'
      }
    ]

    installStorybookAssociationsLoader(customAssociations)

    await expect(loadAssociations()).resolves.toEqual([
      expect.objectContaining({
        id: 'custom-association'
      })
    ])
  })

  it('installs a storybook associations loader that rejects', async () => {
    installStorybookAssociationsLoaderError()

    await expect(loadAssociations()).rejects.toThrow('Associations could not be loaded.')
  })

  it('installs a storybook associations loader that stays pending until the delay elapses', async () => {
    vi.useFakeTimers()
    installStorybookAssociationsLoaderLoading(25)

    const pending = loadAssociations()

    vi.advanceTimersByTime(25)

    await expect(pending).resolves.toEqual([])
  })

  it('restores the default associations loader', async () => {
    installStorybookAssociationsLoader([])
    resetStorybookAssociationsLoader()

    const associations = await loadAssociations()

    expect(associations).toEqual([{ id: 'ipc-association' }])
    expect(globalThis.window.api.getAssociations).toHaveBeenCalledWith('token-1')
  })
})
