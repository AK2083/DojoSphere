import { describe, expect, it } from 'vitest'

import { inferColumnDataType } from './infer-data-type'

describe('inferColumnDataType', () => {
  it('returns text for empty sample sets', () => {
    expect(inferColumnDataType([])).toBe('text')
    expect(inferColumnDataType(['', '   '])).toBe('text')
  })

  it('detects gender columns from value synonyms', () => {
    expect(inferColumnDataType(['m', 'w', 'd', 'männlich'])).toBe('gender')
    expect(inferColumnDataType(['m', 'w', 'd', 'm'])).toBe('gender')
  })

  it('detects registration status columns', () => {
    expect(inferColumnDataType(['gemeldet', 'Nachmeldung', 'gemeldet'])).toBe('registrationStatus')
  })

  it('detects grade columns from kyu values or headers', () => {
    expect(inferColumnDataType(['8. Kyu', '6. Kyu', '9. Kyu'])).toBe('grade')
    expect(inferColumnDataType(['8.', '6.', '9.'], 'Kyu')).toBe('grade')
  })

  it('detects date columns from ISO, year and d/m/y values', () => {
    expect(inferColumnDataType(['2012-01-01', '2011-05-06'])).toBe('date')
    expect(inferColumnDataType(['2012', '2010', '2009'])).toBe('date')
    expect(inferColumnDataType(['01.02.2012', '3/4/2011'])).toBe('date')
  })

  it('detects nationality columns from two-letter codes', () => {
    expect(inferColumnDataType(['de', 'at', 'ch'])).toBe('nationality')
  })

  it('detects boolean columns from yes/no synonyms', () => {
    expect(inferColumnDataType(['ja', 'nein', 'ja'])).toBe('boolean')
  })

  it('detects raw weight columns from plausible kilogram values', () => {
    expect(inferColumnDataType(['45', '52.5', '61'])).toBe('weightKg')
  })

  it('falls back to text when no type dominates', () => {
    expect(inferColumnDataType(['Tokyo Dojo', 'Osaka Dojo', 'random text'])).toBe('text')
  })

  it('detects email columns from headers or values', () => {
    expect(inferColumnDataType(['a@b.invalid', 'c@d.invalid'], 'E-Mail')).toBe('email')
    expect(inferColumnDataType(['x@y.invalid', 'z@w.invalid'])).toBe('email')
  })

  it('returns zero ratio for empty value sets', async () => {
    const { matchesSampleRatio } = await import('./infer-data-type')

    expect(matchesSampleRatio([], () => true)).toBe(0)
  })
})
