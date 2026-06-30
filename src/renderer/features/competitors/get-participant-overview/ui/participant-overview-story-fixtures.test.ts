import { describe, expect, it } from 'vitest'

import { STATIC_PARTICIPANTS } from '../model/static-participants'
import { storyHeaders, storyItems, storySortBy } from './participant-overview-story-fixtures'

describe('participant-overview-story-fixtures', () => {
  it('provides default sort and table headers for stories', () => {
    expect(storySortBy).toEqual([{ key: 'familyName', order: 'asc' }])
    expect(storyHeaders.some((header) => header.key === 'actions')).toBe(true)
    expect(storyHeaders.some((header) => header.key === 'givenName')).toBe(true)
  })

  it('maps static participants to translated gender labels', () => {
    expect(storyItems).toHaveLength(STATIC_PARTICIPANTS.length)
    expect(storyItems[0]?.gender).toBe('Male')
    expect(storyItems[1]?.gender).toBe('Female')
  })
})
