import { describe, expect, it } from 'vitest'

import { STATIC_PARTICIPANTS } from './static-participants'

describe('STATIC_PARTICIPANTS', () => {
  it('provides fictional sample rows for UI prototyping', () => {
    expect(STATIC_PARTICIPANTS).toHaveLength(3)
    expect(STATIC_PARTICIPANTS[0]?.id).toBe('participant-1')
    expect(STATIC_PARTICIPANTS[1]?.givenName).toBe('Anna')
    expect(STATIC_PARTICIPANTS[2]?.club).toBe('SV Süd')
  })
})
