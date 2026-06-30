import { describe, expect, it } from 'vitest'

import { durationTokens } from './duration'

describe('durationTokens', () => {
  it('defines the tooltip open delay in milliseconds', () => {
    expect(durationTokens.tooltip).toBe(600)
  })
})
