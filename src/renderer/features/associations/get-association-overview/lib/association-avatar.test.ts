import { describe, expect, it } from 'vitest'

import { clubAvatarColor, clubHeaderBackground, clubInitials } from './club-avatar'

describe('clubInitials', () => {
  it('returns uppercase initials from the first two words', () => {
    expect(clubInitials('Judoclub Nord e.V.')).toBe('JN')
  })

  it('returns the first two letters for a single word', () => {
    expect(clubInitials('Unknown')).toBe('UN')
  })

  it('returns ? when the name is empty', () => {
    expect(clubInitials('   ')).toBe('?')
  })
})

describe('clubAvatarColor', () => {
  it('returns a stable color for the same club name', () => {
    const firstColor = clubAvatarColor('Judoclub Nord e.V.')
    const secondColor = clubAvatarColor('Judoclub Nord e.V.')

    expect(firstColor).toBe(secondColor)
    expect(firstColor.length).toBeGreaterThan(0)
  })

  it('returns a color for an empty club name', () => {
    expect(clubAvatarColor('')).toBe('teal')
  })
})

describe('clubHeaderBackground', () => {
  it('returns a subtle color-mix background for the club header', () => {
    const background = clubHeaderBackground('Judoclub Nord e.V.')

    expect(background).toContain('color-mix')
    expect(background).toContain('8%')
    expect(background).toContain(clubAvatarColor('Judoclub Nord e.V.'))
  })
})
