import { describe, expect, it } from 'vitest'

import {
  AT_OJV_SYSTEM_ID,
  buildKyuDanGrades,
  DE_DJB_SYSTEM_ID,
  DEFAULT_GRADING_SYSTEM_ID,
  findGradeSeed,
  GRADE_SEEDS,
  GRADING_SYSTEM_SEEDS,
  KODOKAN_SYSTEM_ID,
  resolveGradingSystemIdForGrade
} from './grade-reference-data'

describe('grade-reference-data', () => {
  it('finds known grade seeds', () => {
    const grade = findGradeSeed('a1000000-0000-4000-8000-000000000008')

    expect(grade?.labelKey).toBe('grades.kyu.3')
    expect(grade?.beltColorToken).toBe('judo-belt-green')
  })

  it('returns undefined for unknown grade ids', () => {
    expect(findGradeSeed('unknown-grade')).toBeUndefined()
  })

  it('resolves grading system from grade id', () => {
    expect(resolveGradingSystemIdForGrade('a2000000-0000-4000-8000-000000000001')).toBe(
      AT_OJV_SYSTEM_ID
    )
    expect(resolveGradingSystemIdForGrade('a3000000-0000-4000-8000-000000000003')).toBe(
      KODOKAN_SYSTEM_ID
    )
  })

  it('falls back to default grading system for unknown grades', () => {
    expect(resolveGradingSystemIdForGrade('')).toBe(DEFAULT_GRADING_SYSTEM_ID)
    expect(resolveGradingSystemIdForGrade('unknown-grade')).toBe(DEFAULT_GRADING_SYSTEM_ID)
  })

  it('seeds all grading systems with 20 grades each', () => {
    for (const system of GRADING_SYSTEM_SEEDS) {
      expect(GRADE_SEEDS.filter((grade) => grade.gradingSystemId === system.id)).toHaveLength(20)
    }
  })

  it('assigns kodokan youth belt colors and japanese label keys', () => {
    const grade = findGradeSeed('a3000000-0000-4000-8000-000000000005')

    expect(grade?.labelKey).toBe('grades.kodokan.kyu.6')
    expect(grade?.beltColorToken).toBe('judo-belt-light-blue')

    expect(findGradeSeed('a3000000-0000-4000-8000-000000000008')?.beltColorToken).toBe(
      'judo-belt-green'
    )
    expect(findGradeSeed('a3000000-0000-4000-8000-00000000000b')?.labelKey).toBe(
      'grades.kodokan.dan.1'
    )
  })

  it('assigns dan belt colors by rank', () => {
    expect(findGradeSeed('a1000000-0000-4000-8000-00000000000b')?.beltColorToken).toBe(
      'judo-belt-black'
    )
    expect(findGradeSeed('a1000000-0000-4000-8000-000000000010')?.beltColorToken).toBe(
      'judo-belt-red-white'
    )
    expect(findGradeSeed('a1000000-0000-4000-8000-000000000013')?.beltColorToken).toBe(
      'judo-belt-red'
    )
  })

  it('uses default dan and kyu belt fallbacks in the builder', () => {
    const grades = buildKyuDanGrades({
      gradingSystemId: DE_DJB_SYSTEM_ID,
      idPrefix: 'zz',
      kyuBeltColors: {}
    })

    expect(
      grades.find((grade) => grade.levelType === 'kyu' && grade.levelNumber === 5)?.beltColorToken
    ).toBe('judo-belt-white')
    expect(
      grades.find((grade) => grade.levelType === 'dan' && grade.levelNumber === 1)?.beltColorToken
    ).toBe('judo-belt-black')
  })
})
