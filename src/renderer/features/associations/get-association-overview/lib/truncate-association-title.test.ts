import { describe, expect, it } from 'vitest'

import {
  ASSOCIATION_TITLE_MAX_LENGTH,
  truncateAssociationTitle
} from './truncate-association-title'

describe('truncateAssociationTitle', () => {
  it('returns the name unchanged when within the limit', () => {
    expect(truncateAssociationTitle('JC Nord')).toBe('JC Nord')
    expect(truncateAssociationTitle('a'.repeat(ASSOCIATION_TITLE_MAX_LENGTH))).toBe(
      'a'.repeat(ASSOCIATION_TITLE_MAX_LENGTH)
    )
  })

  it('appends an ellipsis when the name exceeds the limit', () => {
    const name = 'Judoclub Nordrhein-Westfalen e.V.'

    expect(truncateAssociationTitle(name)).toBe(`${name.slice(0, ASSOCIATION_TITLE_MAX_LENGTH)}...`)
    expect(truncateAssociationTitle(name).length).toBe(ASSOCIATION_TITLE_MAX_LENGTH + 3)
  })
})
