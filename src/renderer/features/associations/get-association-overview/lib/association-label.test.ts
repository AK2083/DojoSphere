import { describe, expect, it } from 'vitest'

import { clubLabel } from './club-label'

describe('clubLabel', () => {
  it('returns the club name when no short name is set', () => {
    expect(clubLabel({ name: 'Unknown', shortName: null })).toBe('Unknown')
  })

  it('includes the short name in parentheses when present', () => {
    expect(clubLabel({ name: 'Judoclub Nord e.V.', shortName: 'JC Nord' })).toBe(
      'Judoclub Nord e.V. (JC Nord)'
    )
  })

  it('ignores blank short names', () => {
    expect(clubLabel({ name: 'SV Süd Judo', shortName: '  ' })).toBe('SV Süd Judo')
  })
})
