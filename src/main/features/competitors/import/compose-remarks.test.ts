import { describe, expect, it } from 'vitest'

import { composeParticipantRemarks } from './compose-remarks'

describe('composeParticipantRemarks', () => {
  it('returns trimmed row remarks', () => {
    const remarks = composeParticipantRemarks({
      givenName: 'Lina',
      familyName: 'Bauer',
      startEligible: true,
      remarks: 'Allergiker'
    })

    expect(remarks).toBe('Allergiker')
  })

  it('returns null when no remarks exist', () => {
    expect(
      composeParticipantRemarks({
        givenName: 'Lina',
        familyName: 'Bauer',
        startEligible: true
      })
    ).toBeNull()
  })
})
