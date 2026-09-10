import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadAssociationSelectOptions } from './load-association-options'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

describe('loadAssociationSelectOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      getAssociations: vi.fn().mockResolvedValue([
        {
          id: 'association-2',
          name: 'SV Süd Judo'
        },
        {
          id: 'association-1',
          name: 'Judoclub Nord e.V.'
        },
        {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'Unknown'
        }
      ])
    } as never
  })

  it('loads associations via IPC and sorts them by name', async () => {
    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

    await expect(loadAssociationSelectOptions()).resolves.toEqual([
      { id: 'association-1', name: 'Judoclub Nord e.V.' },
      { id: 'association-2', name: 'SV Süd Judo' }
    ])

    expect(globalThis.window.api.getAssociations).toHaveBeenCalledWith('token-1')
  })

  it('throws when the electron api is unavailable', async () => {
    globalThis.window.api = undefined as never
    vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

    await expect(loadAssociationSelectOptions()).rejects.toThrow('Electron API is not available')
  })

  it('throws when no local session token exists', async () => {
    vi.mocked(getLocalSessionToken).mockReturnValue(null)

    await expect(loadAssociationSelectOptions()).rejects.toThrow('No local session')
  })
})
