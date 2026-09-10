import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createEmptyAssociationForm } from '../model/association-form-state'
import {
  createAssociation,
  loadAssociation,
  mapFormStateToInput,
  updateAssociation
} from './save-association'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

function filledForm() {
  return {
    ...createEmptyAssociationForm(),
    name: '  Judoclub Nord e.V.  ',
    shortName: '  JC Nord  ',
    websiteHost: 'www.jcnord.example',
    districtName: '  Bezirk Hamburg  ',
    associationNumber: '020123',
    headquarters: {
      street: 'Dojostraße',
      houseNumber: '12',
      postalCode: '20095',
      city: 'Hamburg'
    },
    email: 'info@jcnord.example',
    phoneCountryCode: '+49',
    phoneNumber: '40 555 0100'
  }
}

describe('save-association service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      addAssociation: vi.fn().mockResolvedValue({ id: 'association-1' }),
      updateAssociation: vi.fn().mockResolvedValue({ id: 'association-1' }),
      getAssociation: vi.fn().mockResolvedValue({ id: 'association-1' })
    } as never
  })

  describe('mapFormStateToInput', () => {
    it('maps form fields into the IPC create input shape', () => {
      const input = mapFormStateToInput(filledForm())

      expect(input).toMatchObject({
        name: 'Judoclub Nord e.V.',
        shortName: 'JC Nord',
        city: 'Hamburg',
        website: 'https://www.jcnord.example',
        districtName: 'Bezirk Hamburg',
        isActive: true,
        source: 'manual'
      })
      expect(input.identifiers).toEqual([
        expect.objectContaining({
          type: 'djb_association_number',
          value: '020123'
        })
      ])
      expect(input.contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ contactType: 'email', value: 'info@jcnord.example' }),
          expect.objectContaining({ contactType: 'phone', value: '+49 40 555 0100' })
        ])
      )
    })
  })

  describe('loadAssociation', () => {
    it('loads an association via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await loadAssociation('association-1')

      expect(globalThis.window.api.getAssociation).toHaveBeenCalledWith('token-1', 'association-1')
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(loadAssociation('association-1')).rejects.toThrow('No local session')
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(loadAssociation('association-1')).rejects.toThrow(
        'Electron API is not available'
      )
    })
  })

  describe('createAssociation', () => {
    it('sends the mapped input via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await createAssociation(filledForm())

      expect(globalThis.window.api.addAssociation).toHaveBeenCalledWith(
        'token-1',
        expect.objectContaining({
          name: 'Judoclub Nord e.V.',
          districtName: 'Bezirk Hamburg'
        })
      )
    })
  })

  describe('updateAssociation', () => {
    it('sends the mapped input via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await updateAssociation('association-1', filledForm())

      expect(globalThis.window.api.updateAssociation).toHaveBeenCalledWith(
        'token-1',
        'association-1',
        expect.objectContaining({
          name: 'Judoclub Nord e.V.',
          districtName: 'Bezirk Hamburg'
        })
      )
    })
  })
})
