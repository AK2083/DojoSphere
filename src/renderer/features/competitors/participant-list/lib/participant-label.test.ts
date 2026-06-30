import { describe, expect, it } from 'vitest'

import { participantLabel } from './participant-label'

describe('participantLabel', () => {
  it('joins given and family names with a space', () => {
    expect(
      participantLabel({
        givenName: 'Anna',
        familyName: 'Weber'
      })
    ).toBe('Anna Weber')
  })
})
