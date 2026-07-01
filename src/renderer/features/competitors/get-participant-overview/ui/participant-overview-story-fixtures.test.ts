import { describe, expect, it } from 'vitest'

import {
  storyCompetitors,
  storyFieldHeaders,
  storyParticipants
} from './participant-overview-story-fixtures'

describe('participant-overview-story-fixtures', () => {
  it('exports unique participant ids for card stories', () => {
    const ids = storyParticipants.map((participant) => participant.id)

    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
  })

  it('exports competitors aligned with card story ids', () => {
    expect(storyCompetitors.map((competitor) => competitor.id)).toEqual(
      storyParticipants.map((participant) => participant.id)
    )
  })

  it('includes headers required by participant entry summaries', () => {
    const keys = storyFieldHeaders.map((header) => header.key)

    expect(keys).toEqual(
      expect.arrayContaining(['weightClass', 'ageClass', 'gender', 'grade', 'passNumber', 'club'])
    )
  })
})
