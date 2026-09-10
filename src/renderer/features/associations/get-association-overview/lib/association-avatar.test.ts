import { describe, expect, it } from 'vitest'

import {
  associationAvatarColor,
  associationHeaderBackground,
  associationInitials
} from './association-avatar'

describe('associationInitials', () => {
  it('returns uppercase initials from the first two words', () => {
    expect(associationInitials('Judoclub Nord e.V.')).toBe('JN')
  })

  it('returns the first two letters for a single word', () => {
    expect(associationInitials('Unknown')).toBe('UN')
  })

  it('returns ? when the name is empty', () => {
    expect(associationInitials('   ')).toBe('?')
  })
})

describe('associationAvatarColor', () => {
  it('returns a stable color for the same association name', () => {
    const firstColor = associationAvatarColor('Judoclub Nord e.V.')
    const secondColor = associationAvatarColor('Judoclub Nord e.V.')

    expect(firstColor).toBe(secondColor)
    expect(firstColor.length).toBeGreaterThan(0)
  })

  it('returns a color for an empty association name', () => {
    expect(associationAvatarColor('')).toBe('teal')
  })
})

describe('associationHeaderBackground', () => {
  it('returns a subtle color-mix background for the association header', () => {
    const background = associationHeaderBackground('Judoclub Nord e.V.')

    expect(background).toContain('color-mix')
    expect(background).toContain('8%')
    expect(background).toContain(associationAvatarColor('Judoclub Nord e.V.'))
  })
})
