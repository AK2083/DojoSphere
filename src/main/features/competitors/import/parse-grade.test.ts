import { describe, expect, it } from 'vitest'

import { isGradeHeader, isGradeValue, parseGradeFromCell, parseGradeText } from './parse-grade'

describe('parseGradeText', () => {
  it('parses kyu and dan word forms', () => {
    expect(parseGradeText('8. Kyu')).toEqual({ levelType: 'kyu', levelNumber: 8 })
    expect(parseGradeText('3 Dan')).toEqual({ levelType: 'dan', levelNumber: 3 })
    expect(parseGradeText('kyu-8')).toEqual({ levelType: 'kyu', levelNumber: 8 })
  })

  it('rejects invalid values', () => {
    expect(parseGradeText('')).toBeUndefined()
    expect(parseGradeText('white belt')).toBeUndefined()
    expect(parseGradeText('kyu-0')).toBeUndefined()
  })
})

describe('parseGradeFromCell', () => {
  it('uses the column header when the value is only a number', () => {
    expect(parseGradeFromCell('8.', 'Kyu')).toEqual({ levelType: 'kyu', levelNumber: 8 })
    expect(parseGradeFromCell('2', 'Dan')).toEqual({ levelType: 'dan', levelNumber: 2 })
  })

  it('does not infer kyu from a bare number without a grade header', () => {
    expect(parseGradeFromCell('8.', 'Spalte A')).toBeUndefined()
  })

  it('rejects non-numeric values even when the header is a grade column', () => {
    expect(parseGradeFromCell('white belt', 'Kyu')).toBeUndefined()
  })
})

describe('parseGradeLevel', () => {
  it('rejects unknown level types', async () => {
    const { parseGradeLevel } = await import('./parse-grade')

    expect(parseGradeLevel('shodan', '1')).toBeUndefined()
  })
})

describe('isGradeHeader', () => {
  it('detects common German and English grade headers', () => {
    expect(isGradeHeader('Kyu')).toBe(true)
    expect(isGradeHeader('Gürtel')).toBe(true)
    expect(isGradeHeader('Belt rank')).toBe(true)
    expect(isGradeHeader('Vorname')).toBe(false)
  })
})

describe('isGradeValue', () => {
  it('detects explicit grade values', () => {
    expect(isGradeValue('8. Kyu')).toBe(true)
    expect(isGradeValue('8.')).toBe(false)
  })
})
