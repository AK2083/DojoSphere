import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createEmptyParticipantForm } from '../model/participant-form-state'
import { createParticipant, mapFormStateToInput, updateParticipant } from './save-participant'

vi.mock('@features/authentication/service/local-session-storage', () => ({
  getLocalSessionToken: vi.fn()
}))

function filledForm() {
  return {
    ...createEmptyParticipantForm(),
    givenName: '  Yuki  ',
    familyName: '  Tanaka  ',
    gender: 'm' as const,
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: '  JP-000142  ',
    clubId: '00000000-0000-0000-0000-000000000000',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    gradeId: 'a1000000-0000-4000-8000-000000000001',
    licenseNumber: '  WL-1  ',
    contactPhone: '  +49 1  ',
    coach: '  Coach  '
  }
}

describe('save-participant service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.window.api = {
      addCompetitor: vi.fn().mockResolvedValue({ id: 'competitor-1' }),
      updateCompetitor: vi.fn().mockResolvedValue({ id: 'competitor-1' })
    } as never
  })

  describe('mapFormStateToInput', () => {
    it('trims values and converts empty optional fields to null', () => {
      const input = mapFormStateToInput(filledForm())

      expect(input).toMatchObject({
        givenName: 'Yuki',
        familyName: 'Tanaka',
        gender: 'm',
        passNumber: 'JP-000142',
        licenseNumber: 'WL-1',
        contactPhone: '+49 1',
        coach: 'Coach'
      })
    })

    it('maps blank fields to undefined or null', () => {
      const input = mapFormStateToInput(createEmptyParticipantForm())

      expect(input.gender).toBeUndefined()
      expect(input.birthDate).toBeUndefined()
      expect(input.passNumber).toBeUndefined()
      expect(input.gradeId).toBeNull()
      expect(input.licenseNumber).toBeNull()
      expect(input.contactPhone).toBeNull()
      expect(input.coach).toBeNull()
    })
  })

  describe('createParticipant', () => {
    it('sends the mapped input via the electron api', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await createParticipant(filledForm())

      expect(globalThis.window.api.addCompetitor).toHaveBeenCalledWith(
        'token-1',
        expect.objectContaining({ givenName: 'Yuki', familyName: 'Tanaka' })
      )
    })

    it('throws when the electron api is unavailable', async () => {
      globalThis.window.api = undefined as never
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await expect(createParticipant(filledForm())).rejects.toThrow('Electron API is not available')
    })

    it('throws when no local session token exists', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue(null)

      await expect(createParticipant(filledForm())).rejects.toThrow('No local session')
    })
  })

  describe('updateParticipant', () => {
    it('sends the mapped input with the competitor id', async () => {
      vi.mocked(getLocalSessionToken).mockReturnValue('token-1')

      await updateParticipant('competitor-1', filledForm())

      expect(globalThis.window.api.updateCompetitor).toHaveBeenCalledWith(
        'token-1',
        'competitor-1',
        expect.objectContaining({ givenName: 'Yuki' })
      )
    })
  })
})
