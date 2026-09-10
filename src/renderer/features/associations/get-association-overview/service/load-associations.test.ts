import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ASSOCIATION_MOCK_DATA } from '../model/association-mock-data'
import {
  deleteAssociation,
  loadAssociations,
  resetAssociationsLoaderForStorybook,
  setAssociationsLoaderForStorybook
} from './load-associations'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

describe('load-associations service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAssociationsLoaderForStorybook()
    globalThis.window.api = {
      getAssociations: vi.fn().mockResolvedValue([]),
      deleteAssociation: vi.fn().mockResolvedValue(undefined)
    } as never
  })

  afterEach(() => {
    resetAssociationsLoaderForStorybook()
  })

  describe('loadAssociations', () => {
    it('loads associations via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await loadAssociations()

      expect(globalThis.window.api.getAssociations).toHaveBeenCalledWith('token-1')
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(loadAssociations()).rejects.toThrow('Electron API is not available')
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(loadAssociations()).rejects.toThrow('No local session')
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
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')
      vi.mocked(globalThis.window.api.getAssociations).mockResolvedValueOnce([
        ASSOCIATION_MOCK_DATA[0]!
      ])

      await expect(loadAssociations()).resolves.toEqual([ASSOCIATION_MOCK_DATA[0]])
    })
  })

  describe('deleteAssociation', () => {
    it('deletes the association via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await deleteAssociation('association-1')

      expect(globalThis.window.api.deleteAssociation).toHaveBeenCalledWith(
        'token-1',
        'association-1'
      )
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(deleteAssociation('association-1')).rejects.toThrow(
        'Electron API is not available'
      )
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(deleteAssociation('association-1')).rejects.toThrow('No local session')
    })
  })
})
