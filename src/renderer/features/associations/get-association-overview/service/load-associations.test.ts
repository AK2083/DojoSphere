import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useAssociationsStore } from '../../store/use-associations-store'
import { ASSOCIATION_MOCK_DATA } from '../model/association-mock-data'
import {
  deleteAssociation,
  loadAssociations,
  resetAssociationsLoaderForStorybook,
  setAssociationsLoaderForStorybook
} from './load-associations'

describe('load-associations service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAssociationsStore().resetAssociations()
  })

  afterEach(() => {
    resetAssociationsLoaderForStorybook()
  })

  it('returns associations from the Pinia store by default', async () => {
    const associations = await loadAssociations()

    expect(associations).toEqual(ASSOCIATION_MOCK_DATA)
    expect(associations).not.toBe(useAssociationsStore().associations)
  })

  it('deletes a association from the store', async () => {
    const id = ASSOCIATION_MOCK_DATA[0]!.id

    await deleteAssociation(id)

    expect(useAssociationsStore().getAssociationById(id)).toBeUndefined()
  })

  it('throws when deleting a missing association', async () => {
    await expect(deleteAssociation('missing-id')).rejects.toThrow(
      'Association not found: missing-id'
    )
  })

  it('uses an overridden storybook loader until reset', async () => {
    setAssociationsLoaderForStorybook(async () => [
      {
        ...ASSOCIATION_MOCK_DATA[0]!,
        id: 'story-association'
      }
    ])

    await expect(loadAssociations()).resolves.toEqual([
      expect.objectContaining({
        id: 'story-association'
      })
    ])

    resetAssociationsLoaderForStorybook()

    await expect(loadAssociations()).resolves.toEqual(ASSOCIATION_MOCK_DATA)
  })
})
