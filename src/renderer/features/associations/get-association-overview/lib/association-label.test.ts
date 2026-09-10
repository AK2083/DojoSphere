import { describe, expect, it } from 'vitest'

import { associationLabel } from './association-label'

describe('associationLabel', () => {
  it('returns the association name when no short name is set', () => {
    expect(associationLabel({ name: 'Unknown', shortName: null })).toBe('Unknown')
  })

  it('includes the short name in parentheses when present', () => {
    expect(associationLabel({ name: 'Judoclub Nord e.V.', shortName: 'JC Nord' })).toBe(
      'Judoclub Nord e.V. (JC Nord)'
    )
  })

  it('ignores blank short names', () => {
    expect(associationLabel({ name: 'SV Süd Judo', shortName: '  ' })).toBe('SV Süd Judo')
  })
})
