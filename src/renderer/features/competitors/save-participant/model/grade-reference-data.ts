/** Grading system and grade seeds aligned with SQLite migration V004. */
/* eslint-disable jsdoc/require-jsdoc -- generated seed constants */

export type GradingSystemSeed = {
  id: string
  code: string
  nameKey: string
  sportCode: string
  countryCode: string | null
}

export type GradeSeed = {
  id: string
  gradingSystemId: string
  code: string
  labelKey: string
  rankOrder: number
  levelType: 'kyu' | 'dan' | 'mon' | 'other'
  levelNumber: number
  beltColorToken: string | null
}

export const DE_DJB_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000001'
export const AT_OJV_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000002'
export const KODOKAN_SYSTEM_ID = 'f1000000-0000-4000-8000-000000000003'

/** Default grading system for new participant forms (German DJB). */
export const DEFAULT_GRADING_SYSTEM_ID = DE_DJB_SYSTEM_ID

export const GRADING_SYSTEM_SEEDS: GradingSystemSeed[] = [
  {
    id: DE_DJB_SYSTEM_ID,
    code: 'de_djb',
    nameKey: 'gradingSystems.deDjb',
    sportCode: 'judo',
    countryCode: 'DE'
  },
  {
    id: AT_OJV_SYSTEM_ID,
    code: 'at_ojv',
    nameKey: 'gradingSystems.atOjv',
    sportCode: 'judo',
    countryCode: 'AT'
  },
  {
    id: KODOKAN_SYSTEM_ID,
    code: 'kodokan',
    nameKey: 'gradingSystems.kodokan',
    sportCode: 'judo',
    countryCode: 'JP'
  }
]

const RANK_ORDER_HEX = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '0a',
  '0b',
  '0c',
  '0d',
  '0e',
  '0f',
  '10',
  '11',
  '12',
  '13',
  '14'
] as const

/**
 * DJB Kyu belt colors (Graduierungsordnung DJB).
 * 10./9. Kyu: Weiß · 8. Kyu: Weiß-Gelb · 7.: Gelb · 6.: Gelb-Orange · 5.: Orange ·
 * 4.: Orange-Grün · 3.: Grün · 2.: Blau · 1.: Braun
 */
const DE_DJB_KYU_BELTS: Record<number, string> = {
  10: 'judo-belt-white',
  9: 'judo-belt-white',
  8: 'judo-belt-white-yellow',
  7: 'judo-belt-yellow',
  6: 'judo-belt-yellow-orange',
  5: 'judo-belt-orange',
  4: 'judo-belt-orange-green',
  3: 'judo-belt-green',
  2: 'judo-belt-blue',
  1: 'judo-belt-brown'
}

/**
 * ÖJV Kyu belt colors (11.–1. Kyu, mapped onto 10.–1. Kyu in the app).
 * 11./10.: Weiß · 10.: Weiß-Gelb · 9.: Gelb · 8.: Gelb-Orange · 7.: Orange ·
 * 6.: Orange-Grün · 5.: Grün · 4.: Grün-Blau · 3.: Blau · 2.: Blau-Braun · 1.: Braun
 */
const AT_OJV_KYU_BELTS: Record<number, string> = {
  10: 'judo-belt-white',
  9: 'judo-belt-white-yellow',
  8: 'judo-belt-yellow',
  7: 'judo-belt-yellow-orange',
  6: 'judo-belt-orange',
  5: 'judo-belt-orange-green',
  4: 'judo-belt-green',
  3: 'judo-belt-green-blue',
  2: 'judo-belt-blue-brown',
  1: 'judo-belt-brown'
}

/**
 * Kodokan Kyu belt colors: Weiß bis 4. Kyu, Braun ab 3. Kyu (Kodokan-Tradition).
 * Dan: Schwarz (1.–5.), Rot-Weiß (6.–8.), Rot (9.–10.)
 */
const KODOKAN_KYU_BELTS: Record<number, string> = {
  10: 'judo-belt-white',
  9: 'judo-belt-white',
  8: 'judo-belt-white',
  7: 'judo-belt-white',
  6: 'judo-belt-white',
  5: 'judo-belt-white',
  4: 'judo-belt-white',
  3: 'judo-belt-brown',
  2: 'judo-belt-brown',
  1: 'judo-belt-brown'
}

function danBeltColor(dan: number): string {
  if (dan <= 5) {
    return 'judo-belt-black'
  }

  if (dan <= 8) {
    return 'judo-belt-red-white'
  }

  return 'judo-belt-red'
}

function gradeId(idPrefix: string, rankOrder: number): string {
  return `${idPrefix}000000-0000-4000-8000-0000000000${RANK_ORDER_HEX[rankOrder - 1]}`
}

type BuildGradesOptions = {
  gradingSystemId: string
  idPrefix: string
  kyuBeltColors: Record<number, string>
  danBeltColors?: (dan: number) => string
}

export function buildKyuDanGrades(options: BuildGradesOptions): GradeSeed[] {
  const grades: GradeSeed[] = []
  const resolveDanBelt = options.danBeltColors ?? (() => 'judo-belt-black')

  for (let kyu = 10; kyu >= 1; kyu -= 1) {
    const rankOrder = 11 - kyu

    grades.push({
      id: gradeId(options.idPrefix, rankOrder),
      gradingSystemId: options.gradingSystemId,
      code: `kyu-${kyu}`,
      labelKey: `grades.kyu.${kyu}`,
      rankOrder,
      levelType: 'kyu',
      levelNumber: kyu,
      beltColorToken: options.kyuBeltColors[kyu] ?? 'judo-belt-white'
    })
  }

  for (let dan = 1; dan <= 10; dan += 1) {
    const rankOrder = 10 + dan

    grades.push({
      id: gradeId(options.idPrefix, rankOrder),
      gradingSystemId: options.gradingSystemId,
      code: `dan-${dan}`,
      labelKey: `grades.dan.${dan}`,
      rankOrder,
      levelType: 'dan',
      levelNumber: dan,
      beltColorToken: resolveDanBelt(dan)
    })
  }

  return grades
}

export const GRADE_SEEDS: GradeSeed[] = [
  ...buildKyuDanGrades({
    gradingSystemId: DE_DJB_SYSTEM_ID,
    idPrefix: 'a1',
    kyuBeltColors: DE_DJB_KYU_BELTS,
    danBeltColors: danBeltColor
  }),
  ...buildKyuDanGrades({
    gradingSystemId: AT_OJV_SYSTEM_ID,
    idPrefix: 'a2',
    kyuBeltColors: AT_OJV_KYU_BELTS,
    danBeltColors: danBeltColor
  }),
  ...buildKyuDanGrades({
    gradingSystemId: KODOKAN_SYSTEM_ID,
    idPrefix: 'a3',
    kyuBeltColors: KODOKAN_KYU_BELTS,
    danBeltColors: danBeltColor
  })
]

/**
 * Finds a grade seed by its persisted id.
 *
 * @param gradeId - Grade row id from SQLite.
 * @returns Matching seed or undefined.
 */
export function findGradeSeed(gradeId: string): GradeSeed | undefined {
  return GRADE_SEEDS.find((grade) => grade.id === gradeId)
}

/**
 * Resolves the grading system id for a grade id.
 *
 * @param gradeId - Grade row id from SQLite.
 * @returns Grading system id or the default when unknown.
 */
export function resolveGradingSystemIdForGrade(gradeId: string): string {
  return findGradeSeed(gradeId)?.gradingSystemId ?? DEFAULT_GRADING_SYSTEM_ID
}
