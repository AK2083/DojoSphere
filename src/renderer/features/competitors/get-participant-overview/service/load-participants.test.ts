import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteParticipant, loadParticipants } from './load-participants'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

describe('load-participants service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      getCompetitors: vi.fn().mockResolvedValue([]),
      deleteCompetitor: vi.fn().mockResolvedValue(undefined)
    } as never
  })

  describe('loadParticipants', () => {
    it('loads competitors via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await loadParticipants()

      expect(globalThis.window.api.getCompetitors).toHaveBeenCalledWith('token-1')
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(loadParticipants()).rejects.toThrow('Electron API is not available')
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(loadParticipants()).rejects.toThrow('No local session')
    })
  })

  describe('deleteParticipant', () => {
    it('deletes the competitor via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await deleteParticipant('competitor-1')

      expect(globalThis.window.api.deleteCompetitor).toHaveBeenCalledWith('token-1', 'competitor-1')
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(deleteParticipant('competitor-1')).rejects.toThrow(
        'Electron API is not available'
      )
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(deleteParticipant('competitor-1')).rejects.toThrow('No local session')
    })
  })
})
