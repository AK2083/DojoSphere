import { describe, expect, it } from 'vitest'

import { participantAvatarColor, participantInitials } from './participant-avatar'

describe('participantInitials', () => {
  it('returns uppercase initials from given and family names', () => {
    expect(
      participantInitials({
        givenName: 'Yuki',
        familyName: 'Tanaka'
      })
    ).toBe('YT')
  })

  it('trims whitespace before taking initials', () => {
    expect(
      participantInitials({
        givenName: '  Anna',
        familyName: 'Weber '
      })
    ).toBe('AW')
  })

  it('returns ? when both names are empty', () => {
    expect(
      participantInitials({
        givenName: '   ',
        familyName: ''
      })
    ).toBe('?')
  })

  it('returns a single initial when only one name is present', () => {
    expect(
      participantInitials({
        givenName: 'Leo',
        familyName: ''
      })
    ).toBe('L')
  })
})

describe('participantAvatarColor', () => {
  it('returns a stable color for the same club', () => {
    const firstColor = participantAvatarColor('Dojo Nord')
    const secondColor = participantAvatarColor('Dojo Nord')

    expect(firstColor).toBe(secondColor)
    expect(firstColor.length).toBeGreaterThan(0)
  })

  it('returns a color for an empty club name', () => {
    expect(participantAvatarColor('')).toBe('teal')
  })
})
